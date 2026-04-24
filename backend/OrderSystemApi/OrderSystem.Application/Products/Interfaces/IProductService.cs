using OrderSystem.Application.Common.Models;
using OrderSystem.Application.Products.DTOs.Requests;
using OrderSystem.Application.Products.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Products.Interfaces
{
    public interface IProductService
    {
        Task<PagedResult<ProductResponse>> GetProductsAsync(ProductQueryRequest request, CancellationToken ct);
        Task<ProductDetailsResponse> GetProductByIdAsync(long productId, CancellationToken ct);
        Task<long> CreateProductAsync(CreateProductRequest request, CancellationToken ct);
        Task UpdateProductAsync(long productId, UpdateProductRequest request, CancellationToken ct);
        Task<int> BulkUpdateStatusAsync(List<long> productIds, bool isActive, CancellationToken ct);
        Task<int> BulkUpdatePriceAsync(List<long> productIds, decimal percentageChange, CancellationToken ct);
   
    }
}
