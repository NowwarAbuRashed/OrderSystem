using OrderSystem.Application.Categories.DTOs.Requests;
using OrderSystem.Application.Categories.DTOs.Responses;
using OrderSystem.Application.Categories.Interfaces;
using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Categories.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<CategoryResponse>> GetCategoriesAsync(CancellationToken ct)
        {
            var categories = await _categoryRepository.GetAllAsync(ct);

            return categories.Select(category => new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name
            }).ToList();
        }

        public async Task<long> CreateCategoryAsync(CreateCategoryRequest request, CancellationToken ct)
        {
            var category = new Category
            {
                Name = request.Name
            };

            return await _categoryRepository.AddAsync(category, ct);
          
        }

        public async Task<bool> UpdateCategoryAsync(long categoryId, UpdateCategoryRequest request, CancellationToken ct)
        {
            var category = await _categoryRepository.GetByIdAsync(categoryId, ct);

            if (category is null)
                return false;

            category.Name = request.Name;

            return await _categoryRepository.Update(category);
        }

        public async Task<bool> DeleteCategoryAsync(long categoryId, CancellationToken ct)
        {
            var category = await _categoryRepository.GetByIdAsync(categoryId, ct);

            if (category is null)
                return false;

            return await _categoryRepository.Remove(category);
        }
    }
}
