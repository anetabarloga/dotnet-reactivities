using System.Reflection.Metadata.Ecma335;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        // we must return a result despite sending a command as we need the public id and url back
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        class Handler : IRequestHandler<Command, Result<Photo>>
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

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                // get user from db using eager loading
                var user = await context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

                if (user == null)
                {
                    return null;
                }

                var photoUploadResult = await photoAccessor.AddPhoto(request.File);
                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                // set photo as main if no main set for user
                if (!user.Photos.Any(p => p.IsMain))
                {
                    photo.IsMain = true;
                }

                user.Photos.Add(photo);

                var result = await context.SaveChangesAsync() > 0;

                return (result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Problem adding photo."));
            }
        }
    }
}