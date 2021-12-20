using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                this.context = context;
                this.accessor = accessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // get activity from db
                var activity = await context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.AppUser).FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null!;

                var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == accessor.GetUsername());

                if (user == null) return null!;

                var HostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser.UserName;
                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                // if user is host - cancel event
                if (attendance != null && HostUsername == user.UserName)
                {
                    activity.isCancelled = !activity.isCancelled;
                }

                // if user is attending even but not host - remove attendance
                else if (attendance != null && HostUsername != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }

                // if user not on attendance list - add attendance
                else if (attendance == null)
                {
                    attendance = new ActivityAttendee { AppUser = user, Activity = activity, IsHost = false };
                    activity.Attendees.Add(attendance);
                }

                var result = await context.SaveChangesAsync() > 0;
                return (result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update the activity."));

            }
        }
    }
}