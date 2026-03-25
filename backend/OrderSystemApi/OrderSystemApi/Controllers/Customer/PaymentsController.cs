using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Payments.DTOs.Requests;
using OrderSystem.Application.Payments.Interfaces;

namespace OrderSystem.Api.Controllers.Customer
{
    [ApiController]
    [Route("api/v1/me/orders")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet("{orderId:long}/payment")]
        public async Task<IActionResult> GetPaymentForOrder(
            long orderId,
            CancellationToken cancellationToken)
        {
            var result = await _paymentService.GetPaymentForOrderAsync(orderId, cancellationToken);
            return Ok(result);
        }

        [HttpPost("{orderId:long}/pay/card")]
        public async Task<IActionResult> PayByCard(
            long orderId,
            [FromBody] PayByCardRequest request,
            CancellationToken cancellationToken)
        {
            var result = await _paymentService.PayByCardAsync(orderId, request, cancellationToken);
            return Ok(result);
        }
    }
}
