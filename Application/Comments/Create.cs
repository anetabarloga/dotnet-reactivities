using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;

public class Create
{
    public class Command : IRequest<Result<CommentDto>>
    {
        public string Body { get; set; }
        public Guid ActivityId { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Body).NotEmpty();
            RuleFor(x => x.ActivityId).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
        private readonly DataContext context;
        private readonly IUserAccessor userAccessor;
        private readonly IMapper mapper;

        public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
        {
            this.context = context;
            this.userAccessor = userAccessor;
            this.mapper = mapper;
        }

        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync(request.ActivityId);

            if (activity == null) return null;

            var user = await context.Users
                .Include(p => p.Photos.Where(x => x.IsMain))
                .SingleOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

            if (user == null) return null;

            var comment = new Comment
            {
                Author = user,
                Activity = activity,
                Body = request.Body
            };

            activity.Comments.Add(comment);

            var success = await context.SaveChangesAsync() > 0;

            return success ? Result<CommentDto>.Success(mapper.Map<CommentDto>(comment)) : Result<CommentDto>.Failure("Failed to add a comment");
        }
    }

}