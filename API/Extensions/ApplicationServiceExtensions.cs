using Application.Activities;
using Application.Core;
using MediatR;

namespace API.Extensions;
public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {

        // Add services to the container
        services.AddCors(opt =>
        {
            opt.AddPolicy("CorsPolicy", policy =>
        {
              policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
          });
        });


        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
        });

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        // we must tell the mediator where and in which assembly the handlers are located
        services.AddMediatR(typeof(List.Handler).Assembly);
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);

        return services;
    }
}