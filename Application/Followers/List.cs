using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate;
            public string Username;

        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
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

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":

                        profiles = await context.UserFollowings
                            .Where(x => x.Target.UserName == request.Username)
                            .Select(u => u.Observer)
                            .ProjectTo<Profiles.Profile>(mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUsername() })
                            .ToListAsync();

                        break;

                    case "following":

                        profiles = await context.UserFollowings
                            .Where(x => x.Observer.UserName == request.Username)
                            .Select(u => u.Target)
                            .ProjectTo<Profiles.Profile>(mapper.ConfigurationProvider, new { currentUsername = userAccessor.GetUsername() })
                            .ToListAsync();

                        break;

                    default:
                        throw new Exception("Predicate unknown");
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}