using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")] // placeholder that will take the first part of class name and ignore the 'controller' bit so here WeatherForecast
public class BaseApiController : ControllerBase
{

}