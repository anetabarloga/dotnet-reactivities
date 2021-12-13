using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
  public class Create
  {
    // we are not returning anything as commands dont return
    public class Command : IRequest
    {
      public Activity Activity { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;

      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        _context.Activities.Add(request.Activity);
        await _context.SaveChangesAsync();

        // Handle onterface must return something. We will just return the unit value to let API controller know that we finished the task. This doesnt really return anything useful.
        return Unit.Value;
      }
    }
  }
}