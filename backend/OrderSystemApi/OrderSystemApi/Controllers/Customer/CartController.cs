using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Carts.DTOs.Requests;
using OrderSystem.Application.Carts.Interfaces;

namespace OrderSystem.Api.Controllers.Customer
{
    [ApiController]
    [Route("api/v1/me/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyCart(CancellationToken cancellationToken)
        {
            var customerId = 1L; // مؤقتًا بدون security
            var result = await _cartService.GetMyCartAsync(customerId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItem(
            [FromBody] AddCartItemRequest request,
            CancellationToken cancellationToken)
        {
            var customerId = 1L; // مؤقتًا بدون security
            var result = await _cartService.AddItemAsync(customerId, request, cancellationToken);
            return Ok(result);
        }

        [HttpPut("items/{itemId:long}")]
        public async Task<IActionResult> UpdateItem(
            long itemId,
            [FromBody] UpdateCartItemRequest request,
            CancellationToken cancellationToken)
        {
            var customerId = 1L; // مؤقتًا بدون security
            var result = await _cartService.UpdateItemAsync(customerId, itemId, request, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("items/{itemId:long}")]
        public async Task<IActionResult> DeleteItem(
            long itemId,
            CancellationToken cancellationToken)
        {
            var customerId = 1L; // مؤقتًا بدون security
            await _cartService.RemoveItemAsync(customerId, itemId, cancellationToken);
            return NoContent();
        }

        [HttpDelete("items")]
        public async Task<IActionResult> ClearCart(CancellationToken cancellationToken)
        {
            var customerId = 1L; // مؤقتًا بدون security
            await _cartService.ClearCartAsync(customerId, cancellationToken);
            return NoContent();
        }
    }
}