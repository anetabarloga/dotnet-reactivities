using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.context = context;
                this.mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUsername() })
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                // we don't have to specify failure here. We will check in the API controller if the activity is null and handle the error there.
                return Result<ActivityDto>.Success(activity);
            }
        }
    }
}