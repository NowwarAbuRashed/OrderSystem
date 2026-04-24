using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Products.Interfaces
{
    public interface IProductRepository
    {
        Task<(List<Product> Items, int TotalCount)> GetPagedAsync(
                   string? search,
                   long? categoryId,
                   int page,
                   int pageSize,
                   CancellationToken ct);
        Task<Product?> GetByIdAsync(long id, CancellationToken ct);
        Task<List<Product>> GetByIdsAsync(IEnumerable<long> ids, CancellationToken ct);
        Task<long> AddAsync(Product product, CancellationToken ct);
        Task<bool> Update(Product product);
        Task<bool> UpdateBulk(IEnumerable<Product> products);
        Task<bool> DeleteAsync(long id);
    }
}
