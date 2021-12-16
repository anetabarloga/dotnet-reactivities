using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
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
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // get activity from db
                var activity = await context.Activities.FindAsync(request.Activity.Id);

                if (activity == null) return null!;

                mapper.Map(request.Activity, activity);
                //activity.Title = request.Activity.Title ?? activity.Title;

                var result = await context.SaveChangesAsync() > 0;

                return (result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update the activity."));

            }
        }
    }
}