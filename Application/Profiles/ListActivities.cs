using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class ListActivities
{
    public class Query : IRequest<Result<List<UserActivityDto>>>
    {
        public string Username { get; set; }
        public string Predicate { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activityAttendees = context.ActivityAttendees
                .Where(x => x.AppUser.UserName == request.Username)
                .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider)
                .OrderBy(d => d.Date)
                .AsQueryable();


            activityAttendees = request.Predicate switch
            {
                "hosting" => activityAttendees = activityAttendees.Where(x => x.HostUsername == request.Username),
                "past" => activityAttendees = activityAttendees.Where(x => x.Date < DateTime.Now),
                _ => activityAttendees = activityAttendees.Where(x => x.Date >= DateTime.Now)
            };

            return Result<List<UserActivityDto>>.Success(await activityAttendees.ToListAsync());
        }
    }
}
