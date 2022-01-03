using Application.Followers;
using Application.Followings;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<ActionResult<Unit>> Follow(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command { targetUsername = username }));
        }

        [HttpGet("{username}")]
        public async Task<ActionResult> GetFollowings(string predicate, string username)
        {
            return HandleResult(await Mediator.Send(new List.Query { Username = username, Predicate = predicate }));
        }
    }
}