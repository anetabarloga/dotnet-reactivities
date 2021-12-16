
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // Why do we return Units? Handle interface must return something. We will just return the unit value to let API controller know that we finished the task. This doesnt really return anything useful.
        // we return a Result<Unit> in order to send back a success/failure response. Commands don't normally return anything else.
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity);

                // check the result of applying changes in the db in order to get back a success/error response
                // SaveChangesAsync returns an integer with te number of new entries written to the db. Thus, if result is 0 it means nothing was written to the db.
                var result = await _context.SaveChangesAsync() > 0;

                return (result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to create the activity."));
            }
        }
    }
}