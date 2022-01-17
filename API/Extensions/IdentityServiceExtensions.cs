using System.Text;
using API.Services;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(opt =>
        {
            opt.Password.RequireNonAlphanumeric = false;
            opt.SignIn.RequireConfirmedEmail = true;
        })
        .AddEntityFrameworkStores<DataContext>()
        .AddSignInManager<SignInManager<AppUser>>()
        .AddDefaultTokenProviders();    // allows to send token for email verification

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
        {
            opt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero // remove default 4 min token refresh window
            };
            opt.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    // get token from query string sent with signalR connection 
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    // add access token to context to get user data and authenticate to the hub
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat"))
                        context.Token = accessToken;

                    return Task.CompletedTask;
                }
            };
        });


        services.AddAuthorization(opt =>
        {
            opt.AddPolicy("IsActivityHost", policy =>
            {
                policy.Requirements.Add(new IsHostRequirement());
            });
        });

        services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
        services.AddScoped<TokenService>();

        return services;
    }
}
