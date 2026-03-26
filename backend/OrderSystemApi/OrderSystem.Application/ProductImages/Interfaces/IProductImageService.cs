using OrderSystem.Application.ProductImage.DTOs.Requests;
using OrderSystem.Application.ProductImage.DTOs.Responses;

namespace OrderSystem.Application.ProductImage.Interfaces
{
    public interface IProductImageService
    {
        Task<List<ProductImageResponse>> GetImagesAsync(long productId, CancellationToken ct);
        Task<long> AddImageAsync(long productId, AddProductImageRequest request, CancellationToken ct);
        Task<bool> UpdateImageAsync(long imageId, UpdateProductImageRequest request, CancellationToken ct);
        Task<bool> DeleteImageAsync(long imageId, CancellationToken ct);
    }

}
