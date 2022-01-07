using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;

            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, opt => opt.MapFrom(src => src.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(d => d.Username, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(d => d.Bio, opt => opt.MapFrom(src => src.AppUser.Bio))
                .ForMember(i => i.Image, opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, opt => opt.MapFrom(src => src.AppUser.Followers.Count))
                .ForMember(d => d.FollowingsCount, opt => opt.MapFrom(src => src.AppUser.Followings.Count))
                .ForMember(d => d.Following, opt => opt.MapFrom(src => src.AppUser.Followers.Any(u => u.Observer.UserName == currentUsername)));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(i => i.Image, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, opt => opt.MapFrom(src => src.Followers.Count))
                .ForMember(d => d.FollowingsCount, opt => opt.MapFrom(src => src.Followings.Count))
                .ForMember(d => d.Following, opt => opt.MapFrom(src => src.Followers.Any(u => u.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(src => src.Author.DisplayName))
                .ForMember(d => d.Username, opt => opt.MapFrom(src => src.Author.UserName))
                .ForMember(i => i.Image, opt => opt.MapFrom(src => src.Author.Photos.FirstOrDefault(x => x.IsMain).Url));


        }
    }
}