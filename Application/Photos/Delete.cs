using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        class Handler : IRequestHandler<Command, Result<Unit>>
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
                // get user from db using eager loading
                var user = await context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

                if (user == null)
                {
                    return null;
                }


                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

                if (photo == null) return null;

                if (photo.IsMain)
                    return Result<Unit>.Failure("You cannot delete your profile photo. Select a new profile photo first.");

                var deleted = await photoAccessor.DeletePhoto(photo.Id);

                if (deleted == null)
                {
                    return Result<Unit>.Failure("Problem deleting photo from Cloudinary.");
                }

                user.Photos.Remove(photo);

                var result = await context.SaveChangesAsync() > 0;

                return (result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem deleting photo from API."));
            }
        }
    }
}