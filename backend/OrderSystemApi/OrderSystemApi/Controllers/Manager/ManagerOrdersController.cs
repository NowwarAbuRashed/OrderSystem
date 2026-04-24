using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Api.Extensions;
using OrderSystem.Application.Orders.DTOs.Requests;
using OrderSystem.Application.Orders.Interfaces;
using OrderSystem.Application.Payments.Interfaces;

namespace OrderSystem.Api.Controllers.Manager
{
    [ApiController]
    [Route("api/v1/manager/orders")]
    [Authorize(Roles = "MANAGER,ADMIN")]
    public class ManagerOrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IPaymentService _paymentService;

        public ManagerOrdersController(IOrderService orderService, IPaymentService paymentService)
        {
            _orderService = orderService;
            _paymentService = paymentService;
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
            var performedByUserId = User.GetUserId();
            var result = await _orderService.MarkReadyAsync(orderId, performedByUserId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{orderId:long}/out-for-delivery")]
        public async Task<IActionResult> MarkOutForDelivery(
            long orderId,
            CancellationToken cancellationToken)
        {
            var performedByUserId = User.GetUserId();
            var result = await _orderService.MarkOutForDeliveryAsync(orderId, performedByUserId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{orderId:long}/delivered")]
        public async Task<IActionResult> MarkDelivered(
            long orderId,
            CancellationToken cancellationToken)
        {
            var performedByUserId = User.GetUserId();
            var result = await _orderService.MarkDeliveredAsync(orderId, performedByUserId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{orderId:long}/cash-collected")]
        public async Task<IActionResult> MarkCashCollected(
            long orderId,
            CancellationToken cancellationToken)
        {
            var result = await _paymentService.MarkCashPaidAsync(orderId, cancellationToken);
            return Ok(result);
        }
    }
}
