using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class SetMain
{
    public class Command : IRequest<Result<Unit>>
    {
        public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext context;
        private readonly IPhotoAccessor photoAccessor;
        private readonly IUserAccessor userAccessor;

        public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
        {
            this.context = context;
            this.photoAccessor = photoAccessor;
            this.userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

            if (user == null)
                return null;

            var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

            if (photo == null)
                return null;

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if (currentMain != null)
            {
                currentMain.IsMain = false;
            }

            photo.IsMain = true;

            var result = await context.SaveChangesAsync() > 0;

            return (result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem setting main photo."));
        }
    }

}