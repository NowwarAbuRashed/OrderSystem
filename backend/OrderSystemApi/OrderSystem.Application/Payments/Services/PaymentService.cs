using OrderSystem.Application.Payments.DTOs.Requests;
using OrderSystem.Application.Payments.DTOs.Responses;
using OrderSystem.Application.Payments.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Payments.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly OrderSystem.Application.Orders.Interfaces.IOrderRepository _orderRepository;

        public PaymentService(
            IPaymentRepository paymentRepository,
            OrderSystem.Application.Orders.Interfaces.IOrderRepository orderRepository)
        {
            _paymentRepository = paymentRepository;
            _orderRepository = orderRepository;
        }

        public async Task<PaymentResponse> GetPaymentForOrderAsync(
            long customerId,
            long orderId,
            CancellationToken cancellationToken)
        {
           

            var order = await _orderRepository.GetByIdForCustomerAsync(
                orderId,
                customerId,
                cancellationToken);

            if (order == null)
                throw new Exception("Order not found");

            var payment = await _paymentRepository.GetByOrderIdAsync(orderId, cancellationToken);

            if (payment == null)
                throw new Exception("Payment not found");

            return MapPaymentResponse(payment);
        }

        public async Task<PaymentResponse> PayByCardAsync(
            long customerId,
            long orderId,
            PayByCardRequest request,
            CancellationToken cancellationToken)
        {
            

            var order = await _orderRepository.GetByIdForCustomerAsync(
                orderId,
                customerId,
                cancellationToken);

            if (order == null)
                throw new Exception("Order not found");

            var payment = await _paymentRepository.GetByOrderIdAsync(orderId, cancellationToken);

            if (payment == null)
                throw new Exception("Payment not found");

            if (payment.PaymentMethod != PaymentMethod.CARD)
                throw new Exception("This order is not configured for card payment");

            if (payment.Status == PaymentStatus.PAID)
                throw new Exception("Payment is already completed");

            if (string.IsNullOrWhiteSpace(request.CardHolderName) ||
                string.IsNullOrWhiteSpace(request.CardNumber) ||
                string.IsNullOrWhiteSpace(request.Cvv) ||
                request.ExpiryMonth <= 0 ||
                request.ExpiryMonth > 12 ||
                request.ExpiryYear <= 0)
            {
                throw new Exception("Invalid card details");
            }

            payment.Status = PaymentStatus.PAID;
            payment.PaidAt = DateTime.UtcNow;
            payment.TransactionRef = $"CARD-{Guid.NewGuid():N}";

            _paymentRepository.Update(payment);

            return MapPaymentResponse(payment);
        }

        public async Task MarkCashPaidAsync(
            long orderId,
            CancellationToken cancellationToken)
        {
            var payment = await _paymentRepository.GetByOrderIdAsync(orderId, cancellationToken);

            if (payment == null)
                throw new Exception("Payment not found");

            if (payment.PaymentMethod != PaymentMethod.CASH)
                throw new Exception("This order is not configured for cash payment");

            if (payment.Status == PaymentStatus.PAID)
                return;

            payment.Status = PaymentStatus.PAID;
            payment.PaidAt = DateTime.UtcNow;
            payment.TransactionRef = $"CASH-{Guid.NewGuid():N}";

            _paymentRepository.Update(payment);
        }

        private static PaymentResponse MapPaymentResponse(Payment payment)
        {
            return new PaymentResponse
            {
                PaymentId = payment.Id,
                OrderId = payment.OrderId,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status,
                Amount = payment.Amount,
                TransactionRef = payment.TransactionRef,
                PaidAt = payment.PaidAt,
                CreatedAt = payment.CreatedAt
            };
        }
    }
}
