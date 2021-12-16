using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;

[ApiController]
[Route("api/[controller]")] // placeholder that will take the first part of class name and ignore the 'controller' bit so here WeatherForecast
public class BaseApiController : ControllerBase
{
    private IMediator _mediator;

    // if mediator is null (null coalescing operator )
    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>()!;


    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if (result.isSuccess && result.Value != null)
        {
            return Ok(result.Value);
        }
        else if ((result.isSuccess && result.Value == null) || result == null)
        {
            return NotFound();
        }
        else
        {
            return BadRequest(result.Error);
        }
    }

}