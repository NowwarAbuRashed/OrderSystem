using OrderSystem.Application.ProductImage.DTOs.Requests;
using OrderSystem.Application.ProductImage.DTOs.Responses;
using OrderSystem.Application.ProductImage.Interfaces;
using OrderSystem.Domain.Entities;
namespace OrderSystem.Application.ProductImage.Services
{
    public class ProductImageService : IProductImageService
    {
     
            private readonly IProductImageRepository _productImageRepository;

            public ProductImageService(IProductImageRepository productImageRepository)
            {
                _productImageRepository = productImageRepository;
            }

            public async Task<List<ProductImageResponse>> GetImagesAsync(long productId, CancellationToken ct)
            {
                var images = await _productImageRepository.GetByProductIdAsync(productId, ct);

                return images
                    .OrderBy(x => x.SortOrder)
                    .Select(x => new ProductImageResponse
                    {
                        Id = x.Id,
                        ImageUrl = x.ImageUrl,
                        AltText = x.AltText ?? string.Empty,
                        SortOrder = x.SortOrder,
                        IsPrimary = x.IsPrimary
                    })
                    .ToList();
            }

            public async Task<long> AddImageAsync(long productId, AddProductImageRequest request, CancellationToken ct)
            {
                if (string.IsNullOrWhiteSpace(request.ImageUrl))
                    throw new ArgumentException("ImageUrl is required.");

                var images = await _productImageRepository.GetByProductIdAsync(productId, ct);
                

                //if (request.IsPrimary)
                //{
                //    foreach (var image in images.Where(x => x.IsPrimary))
                //    {
                //        image.IsPrimary = false;
                //        _productImageRepository.Update(image);
                //    }
                //}

                var newImage = new OrderSystem.Domain.Entities.ProductImage
                {
                    ProductId = productId,
                    ImageUrl = request.ImageUrl,
                    AltText = request.AltText,
                    SortOrder = request.SortOrder,
                    IsPrimary = request.IsPrimary,
                    CreatedAt = DateTime.UtcNow
                };

                await _productImageRepository.AddAsync(newImage, ct);
  

                return newImage.Id;
            }

            public  async Task<bool> UpdateImageAsync(long imageId, UpdateProductImageRequest request, CancellationToken ct)
            {
                var image = await _productImageRepository.GetByIdAsync(imageId, ct);

                if (image is null)
                    throw new KeyNotFoundException($"Product image with id {imageId} was not found.");

                if (!string.IsNullOrWhiteSpace(request.ImageUrl))
                    image.ImageUrl = request.ImageUrl;

                if (request.AltText is not null)
                    image.AltText = request.AltText;

                if (request.SortOrder.HasValue)
                    image.SortOrder = request.SortOrder.Value;

                if (request.IsPrimary.HasValue)
                {
                    if (request.IsPrimary.Value)
                    {
                        var images = await _productImageRepository.GetByProductIdAsync(image.ProductId, ct);

                        foreach (var item in images.Where(x => x.IsPrimary && x.Id != image.Id))
                        {
                            item.IsPrimary = false;
                            _productImageRepository.Update(item);
                        }
                    }

                    image.IsPrimary = request.IsPrimary.Value;
                }

            OrderSystem.Domain.Entities.ProductImage updatedImage = new OrderSystem.Domain.Entities.ProductImage();
            

              return  await _productImageRepository.Update(updatedImage);
            
            }

            public async Task<bool> DeleteImageAsync(long imageId, CancellationToken ct)
            {
                var image = await _productImageRepository.GetByIdAsync(imageId, ct);

                if (image is null)
                    throw new KeyNotFoundException($"Product image with id {imageId} was not found.");


            return await _productImageRepository.Remove(imageId);
        }
        }
    }
