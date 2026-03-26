using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Orders.DTOs.Requests;
using OrderSystem.Application.Orders.Interfaces;

namespace OrderSystem.Api.Controllers.Manager
{
    [ApiController]
    [Route("api/v1/manager/orders")]
    public class ManagerOrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public ManagerOrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders(
            [FromQuery] OrderQueryRequest request,
            CancellationToken cancellationToken)
        {
            var result = await _orderService.GetAllOrdersAsync(request, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{orderId:long}")]
        public async Task<IActionResult> GetOrderById(
            long orderId,
            CancellationToken cancellationToken)
        {
            var result = await _orderService.GetOrderByIdAsync(orderId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{orderId:long}/ready")]
        public async Task<IActionResult> MarkReady(
            long orderId,
            CancellationToken cancellationToken)
        {
            var result = await _orderService.MarkReadyAsync(orderId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{orderId:long}/out-for-delivery")]
        public async Task<IActionResult> MarkOutForDelivery(
            long orderId,
            CancellationToken cancellationToken)
        {
            var result = await _orderService.MarkOutForDeliveryAsync(orderId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{orderId:long}/delivered")]
        public async Task<IActionResult> MarkDelivered(
            long orderId,
            CancellationToken cancellationToken)
        {
            var result = await _orderService.MarkDeliveredAsync(orderId, cancellationToken);
            return Ok(result);
        }
    }
}
