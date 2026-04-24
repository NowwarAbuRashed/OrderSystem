using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Categories.DTOs.Requests;
using OrderSystem.Application.Categories.Interfaces;

using Microsoft.AspNetCore.Authorization;

namespace OrderSystem.Api.Controllers.Manager
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize(Roles = "MANAGER,ADMIN")]
    public class ManagerCategoriesController : ControllerBase
    {
        readonly ICategoryService _categoryService;
        public ManagerCategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(
            [FromBody] CreateCategoryRequest request,
            CancellationToken ct)
        {
            var categoryId = await _categoryService.CreateCategoryAsync(request, ct);
            return Ok(new { Id = categoryId, Message = "Category created successfully" });
        }

        [HttpPut("{categoryId:long}")]
        public async Task<IActionResult> UpdateCategory(
            long categoryId,
            [FromBody] UpdateCategoryRequest request,
            CancellationToken ct)
        {
            var updated = await _categoryService.UpdateCategoryAsync(categoryId, request, ct);

            if (!updated)
                return NotFound(new { Message = "Category not found" });

            return Ok(new { Message = "Category updated successfully" });
        }

        [HttpDelete("{categoryId:long}")]
        public async Task<IActionResult> DeleteCategory(
            long categoryId,
            CancellationToken ct)
        {
            var deleted = await _categoryService.DeleteCategoryAsync(categoryId, ct);

            if (!deleted)
                return NotFound(new { Message = "Category not found" });

            return Ok(new { Message = "Category deleted successfully" });
        }
    }
}
