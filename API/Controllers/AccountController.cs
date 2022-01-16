using System.Security.Claims;
using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService tokenService;
        private readonly IConfiguration config;
        private readonly HttpClient httpClient;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService, IConfiguration config)
        {
            this.tokenService = tokenService;
            this.config = config;
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
                var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

                if (result.Succeeded)
                {
                    return CreateUserDto(user);
                }
            }

            return Unauthorized();
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

            return (result.Succeeded ? CreateUserDto(user) : BadRequest("Registration unsuccessfull."));
        }


        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

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


                        var result = await userManager.CreateAsync(user);

                        if (!result.Succeeded)
                            return BadRequest("Problem creating user account.");
                    }

                    return CreateUserDto(user);
                }
            }

            return Unauthorized();
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
}