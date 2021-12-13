using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Persistence;

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