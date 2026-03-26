using OrderSystem.Application.ProductImage.DTOs.Requests;
using OrderSystem.Application.ProductImage.DTOs.Responses;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Application.ProductImage.Interfaces
{
    public interface IProductImageRepository
    {
        Task<List<OrderSystem.Domain.Entities.ProductImage>> GetByProductIdAsync(long productId, CancellationToken ct);
        Task<OrderSystem.Domain.Entities.ProductImage?> GetByIdAsync(long imageId, CancellationToken ct);
        Task<long> AddAsync(OrderSystem.Domain.Entities.ProductImage image, CancellationToken ct);
        Task<bool> Update(OrderSystem.Domain.Entities.ProductImage image);
        Task<bool> Remove(long ImageId);
    }

}
