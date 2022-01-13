using API.SignalR;
using Application.Activities;
using Microsoft.OpenApi.Any;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(opt =>
{
    // every endpoint in the API will require authorization unless specified otherwise using [AllowAnonymous]
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
})

.AddFluentValidation(config =>
{
    // we specify where the validations are coming from (Application layer) by speifying the class where validator lay. Specifying a single class from the assembly will suffice.
    config.RegisterValidatorsFromAssemblyContaining<Create>();
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddHttpContextAccessor();


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

// security headers
app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCsp(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com", "blob:"))
    .ScriptSources(s => s.Self().CustomSources("sha256-vlr3dtCFRyQ4xYPDJ6OPXr661dki/90PZIXzPqkQUVs=")));

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) =>
    {
        // security policy - if the site was accessed using HTTPS then the browser notes it down and future request using HTTP will be redirected to HTTPS
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");

        // call the next piece of middleware 
        await next.Invoke();
    });
}

app.UseDefaultFiles();  // use index.html as default
app.UseStaticFiles();   // serce static files from wwwroot

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

// map endpoints

app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback");


AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Seed data
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Error occured during migration");
}

await app.RunAsync();
// app.Run();
