using OrderSystem.Application.Payments.DTOs.Requests;
using OrderSystem.Application.Payments.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Payments.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponse> GetPaymentForOrderAsync(
            long customerId,
            long orderId,
            CancellationToken cancellationToken);

        Task<PaymentResponse> PayByCardAsync(
            long customerId,
            long orderId,
            PayByCardRequest request,
            CancellationToken cancellationToken);

        Task MarkCashPaidAsync(
            long orderId,
            CancellationToken cancellationToken);
    }
}
