using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Inventorys.Interfaces;

namespace OrderSystem.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/inventory")]
    [Authorize(Roles = "ADMIN")]
    public class AdminInventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public AdminInventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetInventoryStatus(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var result = await _inventoryService.GetInventoryStatusAsync(page, pageSize, cancellationToken);
            return Ok(result);
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var result = await _inventoryService.GetLowStockAsync(page, pageSize, cancellationToken);
            return Ok(result);
        }
    }
}