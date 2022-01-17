using System.Security.Claims;
using System.Text;
using API.DTO;
using API.Services;
using Infrastructure.Email;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> userManager;
    private readonly SignInManager<AppUser> signInManager;
    private readonly TokenService tokenService;
    private readonly IConfiguration config;
    private readonly EmailSender emailSender;
    private readonly HttpClient httpClient;

    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService, IConfiguration config, EmailSender emailSender)
    {
        this.tokenService = tokenService;
        this.config = config;
        this.emailSender = emailSender;
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.httpClient = new HttpClient { BaseAddress = new System.Uri("https://graph.facebook.com") };

    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        // load user from db and eagerly load photo
        var user = await userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == loginDto.Email);

        if (user != null)
        {
            // for development purposes - allow test user bob to login without email confirmation
            if (user.UserName == "bob" || user.UserName == "tom")
                user.EmailConfirmed = true;

            if (!user.EmailConfirmed)
                return Unauthorized("Email address not confirmed.");

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserDto(user);
            }
        }

        return Unauthorized("Email or password invalid.");
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
        {
            ModelState.AddModelError("email", "Email already registered.");
            return ValidationProblem();
        }

        if (await userManager.Users.AnyAsync(u => u.UserName == registerDto.Username))
        {
            // return BadRequest("Username already registered.");
            ModelState.AddModelError("username", "Username taken.");
            return ValidationProblem();
        }

        var user = new AppUser
        {
            UserName = registerDto.Username,
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            Bio = "", // TODO remove completely
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
            return BadRequest("Problem registering user.");

        await SendVerificationEmail(user);

        return Ok("Registration successful - please check your inbox for a verfication email.");
    }

    [AllowAnonymous]
    [HttpPost("verifyEmail")]
    public async Task<IActionResult> VerifyEmail(string token, string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null) return Unauthorized();
        var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);

        var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
        var result = await userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded)
            return BadRequest("Could not verify email address");

        return Ok("Email confirmed. You can now log in.");
    }

    [AllowAnonymous]
    [HttpGet("resendEmailConfirmationLink")]
    public async Task<IActionResult> ResendEmailConfirmation(string email)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user == null)
            return Unauthorized();

        await SendVerificationEmail(user);

        return Ok("Resend email successful - please check your inbox for a verfication email.");

    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

        await SetRefreshToken(user);
        return CreateUserDto(user);
    }

    [AllowAnonymous]
    [HttpPost("fbLogin")]
    public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
    {
        var fbVerifyKeys = config["Facebook:AppId"] + "|" + config["Facebook:AppSecret"];
        var verifyToken = await httpClient
            .GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

        if (verifyToken.IsSuccessStatusCode)
        {
            var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";
            var response = await httpClient.GetAsync(fbUrl);

            if (response.IsSuccessStatusCode)
            {
                var fbInfo = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());
                var username = (string)fbInfo.id;
                var user = await userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == username);

                if (user == null)
                {
                    user = new AppUser
                    {
                        DisplayName = (string)fbInfo.name,
                        Email = (string)fbInfo.email,
                        UserName = (string)fbInfo.id,
                        Bio = "New User",
                        Photos = new List<Photo> {
                                new Photo { Id = "fb_" + (string)fbInfo.id, Url = (string)fbInfo.picture.data.url, IsMain = true }}
                    };

                    // don't require email verification through facebook login
                    user.EmailConfirmed = true;

                    var result = await userManager.CreateAsync(user);

                    if (!result.Succeeded)
                        return BadRequest("Problem creating user account.");
                }
                await SetRefreshToken(user);
                return CreateUserDto(user);
            }
        }

        return Unauthorized();
    }

    [Authorize]
    [HttpPost("refreshToken")]
    public async Task<ActionResult<UserDto>> RefreshToken(string accessToken)
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var user = await userManager.Users.Include(r => r.RefreshTokens).Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

        if (user == null) return Unauthorized();

        var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

        if (oldToken != null)
        {
            if (!oldToken.IsActive)
                return Unauthorized();

            oldToken.Revoked = DateTime.UtcNow;
        }

        return CreateUserDto(user);
    }


    private async Task SetRefreshToken(AppUser user)
    {
        var refreshToken = tokenService.GenerateRefreshToken();
        user.RefreshTokens.Add(refreshToken);

        await userManager.UpdateAsync(user);
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,    // token won't be accessible via JS
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
    }

    private async Task SendVerificationEmail(AppUser user)
    {
        var origin = Request.Headers["origin"];
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

        // encoding is necessary, otherwise the returned value will be deformed and won't match values stored in db
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&&email={user.Email}";
        var message = $"<p>Please click the below link to verify your email address.</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

        await emailSender.SendEmailAsync(user.Email, "Please verify your email", message);
    }

    private ActionResult<UserDto> CreateUserDto(AppUser user)
    {
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Username = user.UserName,
            Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
            Token = tokenService.CreateToken(user)
        };
    }
}