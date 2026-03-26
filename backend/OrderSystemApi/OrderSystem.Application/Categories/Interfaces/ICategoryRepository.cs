using OrderSystem.Application.Categories.DTOs.Requests;
using OrderSystem.Application.ProductImage.DTOs.Requests;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Application.Categories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync(CancellationToken ct);
        Task<Category?> GetByIdAsync(long id, CancellationToken ct);
        Task<long> AddAsync(Category category, CancellationToken ct);
        Task<bool> Update(Category category);
        Task<bool> Remove(Category category);
    }
}
