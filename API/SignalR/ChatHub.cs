

using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class ChatHub : Hub
{
    private readonly IMediator mediator;

    public ChatHub(IMediator mediator)
    {
        this.mediator = mediator;
    }


    public async Task SendComment(Create.Command command)
    {
        // command contains activityId and comment body
        var comment = await mediator.Send(command);

        // send new comment to all connected clients. Each activity has it's own client's group
        await Clients.Group(command.ActivityId.ToString())
            .SendAsync("ReceiveComment", comment.Value);
    }

    public override async Task OnConnectedAsync()
    {
        // use query string params to send additional info
        var httpContext = Context.GetHttpContext();
        var activityId = httpContext.Request.Query["activityId"];

        // add user to activity comments group when connected
        await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

        // send back all activity comments back to caller
        var result = await mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });
        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}
