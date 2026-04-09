using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Api.Extensions;
using OrderSystem.Application.Inventorys.DTOs.Requests;
using OrderSystem.Application.Inventorys.Interfaces;

namespace OrderSystem.Api.Controllers.Manager
{
    [ApiController]
    [Route("api/v1/manager")]
    [Authorize(Roles = "MANAGER,ADMIN")]
    public class ManagerInventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public ManagerInventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpPatch("products/{productId:long}/inventory")]
        public async Task<IActionResult> AdjustInventory(
            long productId,
            [FromBody] AdjustInventoryRequest request,
            CancellationToken cancellationToken)
        {
            var performedBy = User.GetUserId();

            var result = await _inventoryService.AdjustInventoryAsync(
                productId,
                request,
                performedBy,
                cancellationToken);

            return Ok(result);
        }

        [HttpGet("inventory/movements")]
        public async Task<IActionResult> GetMovements(
            [FromQuery] InventoryMovementQueryRequest query,
            CancellationToken cancellationToken)
        {
            var result = await _inventoryService.GetMovementsAsync(query, cancellationToken);
            return Ok(result);
        }
    }
}