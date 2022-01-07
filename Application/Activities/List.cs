using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public PagingParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
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

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // we will defer the execution until a paged list is created
                var activities = context.Activities
                    .OrderBy(d => d.Date)
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUsername() })
                    .AsQueryable();


                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(activities, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }

    }
}