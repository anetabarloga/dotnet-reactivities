using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
  public class Edit
  {
    public class Command : IRequest
    {
      public Activity Activity { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext context;
      private readonly IMapper mapper;

      public Handler(DataContext context, IMapper mapper)
      {
        this.context = context;
        this.mapper = mapper;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        // get activity from db
        var activity = await context.Activities.FindAsync(request.Activity.Id);

        mapper.Map(request.Activity, activity);
        //activity.Title = request.Activity.Title ?? activity.Title;

        await context.SaveChangesAsync();

        return Unit.Value;

      }
    }
  }
}