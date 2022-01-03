using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followings
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string targetUsername;
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await context.Users.FirstOrDefaultAsync(u => u.UserName == userAccessor.GetUsername());
                if (observer == null) return null;

                var target = await context.Users.FirstOrDefaultAsync(u => u.UserName == request.targetUsername);
                if (target == null) return null;

                var following = await context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing { Observer = observer, Target = target };
                    context.UserFollowings.Add(following);
                }
                else
                {
                    context.UserFollowings.Remove(following);
                }

                var success = await context.SaveChangesAsync() > 0;

                return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to add a follower");
            }
        }

    }
}