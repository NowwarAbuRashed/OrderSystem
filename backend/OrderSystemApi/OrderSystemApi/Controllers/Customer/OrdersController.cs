using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Orders.DTOs.Requests;
using OrderSystem.Application.Orders.Interfaces;

namespace OrderSystem.Api.Controllers.Customer
{
    [ApiController]
    [Route("api/v1/me/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> Checkout(
            [FromBody] CheckoutRequest request,
            CancellationToken cancellationToken)
        {
            var result = await _orderService.CheckoutAsync(request, cancellationToken);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders(
            [FromQuery] OrderQueryRequest request,
            CancellationToken cancellationToken)
        {
            var result = await _orderService.GetMyOrdersAsync(request, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{orderId:long}")]
        public async Task<IActionResult> GetMyOrderById(
            long orderId,
            CancellationToken cancellationToken)
        {
            var result = await _orderService.GetMyOrderByIdAsync(orderId, cancellationToken);
            return Ok(result);
        }
    }
}
