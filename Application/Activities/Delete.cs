using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;

            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync(request.Id);

                if (activity == null)
                {
                    // here we simply return null unlike in the create which returned a Success Response with an empty value
                    return null!;
                }

                context.Remove(activity);

                var result = await context.SaveChangesAsync() > 0;

                return (result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Cannot delete the activity."));

            }
        }
    }
}