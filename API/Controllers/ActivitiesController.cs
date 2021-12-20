using Application.Activities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetActivities()
    {
        // inside send we instantiate a new isntance of the handler
        return HandleResult(await Mediator.Send(new List.Query()));
    }

    // activities/id
    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        return HandleResult(await Mediator.Send(new Details.Query { Id = id }));

        // alternative http error handling method
        // return (activity != null ? activity : NotFound());
    }

    [HttpPost]
    // API controller should be able to pick up the activity object from body automatically. IActionResult gives  acces to the http resonse.
    public async Task<IActionResult> CreateActivity(Activity activity)
    {
        // object initializer syntax Command {Sth = sth}
        return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<IActionResult> EditActivity(Guid id, Activity activity)
    {
        activity.Id = id;
        return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<IActionResult> DeleteActivity(Guid id)
    {
        return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
    }

    [HttpPost("{id}/attend")]
    public async Task<IActionResult> Attend(Guid id)
    {
        return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
    }
}
