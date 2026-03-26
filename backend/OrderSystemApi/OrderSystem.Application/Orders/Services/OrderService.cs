using OrderSystem.Application.Common.Models;
using OrderSystem.Application.Orders.DTOs.Requests;
using OrderSystem.Application.Orders.DTOs.Responses;
using OrderSystem.Application.Orders.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Orders.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderItemRepository _orderItemRepository;

        public OrderService(
            IOrderRepository orderRepository,
            IOrderItemRepository orderItemRepository)
        {
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
        }

        public Task<CheckoutResponse> CheckoutAsync(
            CheckoutRequest request,
            CancellationToken cancellationToken)
        {
            throw new NotImplementedException("Checkout depends on Cart and Inventory completion.");
        }

        public async Task<PagedResult<OrderResponse>> GetMyOrdersAsync(
            OrderQueryRequest request,
            CancellationToken cancellationToken)
        {
            // مؤقتًا بدون security
            var customerId = 1L;

            var (items, totalCount) = await _orderRepository.GetPagedForCustomerAsync(
                customerId,
                request,
                cancellationToken);

            var result = items.Select(MapOrderResponse).ToList();

            return new PagedResult<OrderResponse>
            {
                Items = result,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalCount = totalCount
            };
        }

        public async Task<OrderDetailsResponse> GetMyOrderByIdAsync(
            long orderId,
            CancellationToken cancellationToken)
        {
            // مؤقتًا بدون security
            var customerId = 1L;

            var order = await _orderRepository.GetByIdForCustomerAsync(
                orderId,
                customerId,
                cancellationToken);

            if (order == null)
                throw new Exception("Order not found");

            return MapOrderDetailsResponse(order);
        }
        // for manager only
        public async Task<PagedResult<OrderResponse>> GetAllOrdersAsync(
            OrderQueryRequest request,
            CancellationToken cancellationToken)
        {
            var (items, totalCount) = await _orderRepository.GetPagedAsync(
                request,
                cancellationToken);

            var result = items.Select(MapOrderResponse).ToList();

            return new PagedResult<OrderResponse>
            {
                Items = result,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalCount = totalCount
            };
        }

        public async Task<OrderDetailsResponse> GetOrderByIdAsync(
            long orderId,
            CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);

            if (order == null)
                throw new Exception("Order not found");

            return MapOrderDetailsResponse(order);
        }

        public async Task<OrderStatusChangeResponse> MarkReadyAsync(
            long orderId,
            CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);

            if (order == null)
                throw new Exception("Order not found");

            if (order.Status != OrderStatus.PROCESSING)
                throw new Exception("Only processing orders can be marked as ready");

            order.Status = OrderStatus.READY;
            order.ReadyAt = DateTime.UtcNow;

            _orderRepository.Update(order);

            return new OrderStatusChangeResponse
            {
                OrderId = order.Id,
                Status = order.Status,
                Message = "Order marked as ready successfully"
            };
        }

        public async Task<OrderStatusChangeResponse> MarkOutForDeliveryAsync(
            long orderId,
            CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);

            if (order == null)
                throw new Exception("Order not found");

            if (order.Status != OrderStatus.READY)
                throw new Exception("Only ready orders can be marked as out for delivery");

            order.Status = OrderStatus.OUT_FOR_DELIVERY;
            order.OutForDeliveryAt = DateTime.UtcNow;

            _orderRepository.Update(order);

            return new OrderStatusChangeResponse
            {
                OrderId = order.Id,
                Status = order.Status,
                Message = "Order marked as out for delivery successfully"
            };
        }

        public async Task<OrderDeliveredResponse> MarkDeliveredAsync(
            long orderId,
            CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);

            if (order == null)
                throw new Exception("Order not found");

            if (order.Status != OrderStatus.OUT_FOR_DELIVERY)
                throw new Exception("Only out for delivery orders can be marked as delivered");

            order.Status = OrderStatus.DELIVERED;
            order.DeliveredAt = DateTime.UtcNow;

            _orderRepository.Update(order);

            return new OrderDeliveredResponse
            {
                OrderId = order.Id,
                Status = order.Status,
                DeliveredAt = order.DeliveredAt.Value,
                Message = "Order marked as delivered successfully"
            };
        }

        private static OrderResponse MapOrderResponse(Order order)
        {
            return new OrderResponse
            {
                OrderId = order.Id,
                Status = order.Status,
                PaymentMethod = order.PaymentMethod,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt
            };
        }

        private static OrderDetailsResponse MapOrderDetailsResponse(Order order)
        {
            return new OrderDetailsResponse
            {
                OrderId = order.Id,
                CustomerId = order.CustomerId,
                Status = order.Status,
                PaymentMethod = order.PaymentMethod,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                ReadyAt = order.ReadyAt,
                OutForDeliveryAt = order.OutForDeliveryAt,
                DeliveredAt = order.DeliveredAt,
                Items = order.OrderItems.Select(MapOrderItemResponse).ToList()
            };
        }

        private static OrderItemResponse MapOrderItemResponse(OrderItem item)
        {
            return new OrderItemResponse
            {
                OrderItemId = item.Id,
                ProductId = item.productId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                LineTotal = item.LineTotal
            };
        }
    }
}
