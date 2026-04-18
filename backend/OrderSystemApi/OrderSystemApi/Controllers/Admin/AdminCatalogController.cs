using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Products.Interfaces;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystemApi.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/catalog")]
    [Authorize(Roles = "ADMIN")]
    public class AdminCatalogController : ControllerBase
    {
        private readonly IProductService _productService;

        public AdminCatalogController(IProductService productService)
        {
            _productService = productService;
        }

        public class BulkStatusRequest
        {
            public List<long> ProductIds { get; set; } = new();
            public bool IsActive { get; set; }
        }

        [HttpPut("bulk-status")]
        public async Task<IActionResult> BulkStatus([FromBody] BulkStatusRequest request, CancellationToken ct)
        {
            var count = await _productService.BulkUpdateStatusAsync(request.ProductIds, request.IsActive, ct);
            return Ok(new { message = $"Successfully updated {count} products." });
        }

        public class BulkPriceRequest
        {
            public List<long> ProductIds { get; set; } = new();
            public decimal PercentageChange { get; set; }
        }

        [HttpPut("bulk-price")]
        public async Task<IActionResult> BulkPrice([FromBody] BulkPriceRequest request, CancellationToken ct)
        {
            var count = await _productService.BulkUpdatePriceAsync(request.ProductIds, request.PercentageChange, ct);
            return Ok(new { message = $"Successfully updated {count} products." });
        }
    }
}
