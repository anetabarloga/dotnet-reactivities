using API.Extensions;
using Application.Activities;
using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

// check if db exist and if not migrate
using var scope = app.Services.CreateScope();

var services = scope.ServiceProvider;

try
{
  var context = services.GetRequiredService<DataContext>();
  await context.Database.MigrateAsync();
  await Seed.SeedData(context);
}
catch (Exception ex)
{
  var logger = services.GetRequiredService<ILogger>();
  logger.LogError(ex, "Error occured during migration");
}



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  // swagger is like postman
  app.UseSwagger();
  app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
