using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Categories.Interfaces;

namespace OrderSystem.Api.Controllers.Customer
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories(CancellationToken ct)
        {
            var result = await _categoryService.GetCategoriesAsync(ct);
            return Ok(result);
        }
    }
}