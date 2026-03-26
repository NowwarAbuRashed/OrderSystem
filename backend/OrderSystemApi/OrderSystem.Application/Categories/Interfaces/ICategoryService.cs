using OrderSystem.Application.Categories.DTOs.Requests;
using OrderSystem.Application.Categories.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Categories.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryResponse>> GetCategoriesAsync(CancellationToken ct);
        Task<long> CreateCategoryAsync(CreateCategoryRequest request, CancellationToken ct);
        Task<bool> UpdateCategoryAsync(long categoryId, UpdateCategoryRequest request, CancellationToken ct);
        Task<bool> DeleteCategoryAsync(long categoryId, CancellationToken ct);
        
    }
}
