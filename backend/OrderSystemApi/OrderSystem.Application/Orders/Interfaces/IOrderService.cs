using OrderSystem.Application.Common.Models;
using OrderSystem.Application.Orders.DTOs.Requests;
using OrderSystem.Application.Orders.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Orders.Interfaces
{
    public interface IOrderService
    {
        Task<CheckoutResponse> CheckoutAsync(
                    long customerId,
                    CheckoutRequest request,
                    CancellationToken cancellationToken);
        Task<PagedResult<OrderResponse>> GetMyOrdersAsync(
             long customerId,
             OrderQueryRequest request,
             CancellationToken cancellationToken);

        Task<OrderDetailsResponse> GetMyOrderByIdAsync(
            long customerId,
            long orderId,
            CancellationToken cancellationToken);

        Task<PagedResult<OrderResponse>> GetAllOrdersAsync(
            OrderQueryRequest request,
            CancellationToken cancellationToken);

        Task<OrderDetailsResponse> GetOrderByIdAsync(
            long orderId,
            CancellationToken cancellationToken);

        Task<OrderStatusChangeResponse> MarkReadyAsync(
            long orderId,
            CancellationToken cancellationToken);

        Task<OrderStatusChangeResponse> MarkOutForDeliveryAsync(
            long orderId,
            CancellationToken cancellationToken);

        Task<OrderDeliveredResponse> MarkDeliveredAsync(
            long orderId,
            CancellationToken cancellationToken);
    }
}
