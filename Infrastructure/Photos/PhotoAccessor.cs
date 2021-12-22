using Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Infrastructure.Photos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Application.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary cloudinary;

        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
                );

            cloudinary = new Cloudinary(account);
        }

        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if (file.Length > 0)
            {
                // using statement helps free the memory immediately after 
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Width(500).Height(500).Crop("fill").Quality(1).FetchFormat("auto")
                };

                var uploadResult = cloudinary.UploadAsync(uploadParams).Result;

                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                return new PhotoUploadResult { PublicId = uploadResult.PublicId, Url = uploadResult.SecureUrl.ToString() };
            }

            return null!;
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await cloudinary.DestroyAsync(deleteParams);

            return (result.Result == "ok" ? result.Result : null)!;
        }
    }
}