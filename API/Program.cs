using Application.Activities;
using Application.Interfaces;
using Infrastructure.Security;

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
builder.Services.AddScoped<IUserAccessor, UserAccessor>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    // error stack track is hidden in the production build in order to not share sensitive/obscure information with the user.
    // We use custom exception middleware instead of exception pages.
    // app.UseDeveloperExceptionPage();

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

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
    var logger = services.GetRequiredService<ILogger>();
    logger.LogError(ex, "Error occured during migration");
}



await app.RunAsync();
// app.Run();
