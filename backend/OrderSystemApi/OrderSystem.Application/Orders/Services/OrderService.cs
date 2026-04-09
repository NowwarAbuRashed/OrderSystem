using OrderSystem.Application.Carts.Interfaces;
using OrderSystem.Application.Common.Models;
using OrderSystem.Application.Inventorys.Interfaces;
using OrderSystem.Application.Orders.DTOs.Requests;
using OrderSystem.Application.Orders.DTOs.Responses;
using OrderSystem.Application.Orders.Interfaces;
using OrderSystem.Application.Payments.Interfaces;
using OrderSystem.Application.Products.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;


namespace OrderSystem.Application.Orders.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderItemRepository _orderItemRepository;
        private readonly ICartRepository _cartRepository;
        private readonly ICartItemRepository _cartItemRepository;
        private readonly IProductRepository _productRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IInventoryMovementRepository _inventoryMovementRepository;
      
        public OrderService(
            IOrderRepository orderRepository,
            IOrderItemRepository orderItemRepository,
            ICartRepository cartRepository,
            ICartItemRepository cartItemRepository,
            IProductRepository productRepository,
            IPaymentRepository paymentRepository,
            IInventoryMovementRepository inventoryMovementRepository)
        {
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
            _productRepository = productRepository;
            _paymentRepository = paymentRepository;
            _inventoryMovementRepository = inventoryMovementRepository;
        }
        // العملية هاي مش معمولة ك عملية واحة كاملة !! , بدها تحديث بحيث انو لو تمت العمليات كلها اذا دن اذا لا يتراجع عن كل العمليات 
        public async Task<CheckoutResponse> CheckoutAsync(
            CheckoutRequest request,
            CancellationToken cancellationToken)
        {
            // مؤقتًا بدون security
            var customerId = 1L;

            var cart = await _cartRepository.GetActiveCartByCustomerIdAsync(customerId, cancellationToken);
            if (cart == null)
                throw new Exception("Active cart not found");

            var cartItems = await _cartItemRepository.GetByCartIdAsync(cart.Id, cancellationToken);
            if (cartItems == null || cartItems.Count == 0)
                throw new Exception("Cart is empty");

            decimal totalAmount = 0m;

            foreach (var cartItem in cartItems)
            {
                if (cartItem.Product == null)
                    throw new Exception($"Product not found for cart item {cartItem.Id}");

                if (cartItem.Product.Status != ProductStatus.ACTIVE)
                    throw new Exception($"Product '{cartItem.Product.Name}' is not active");

                if (cartItem.Quantity <= 0)
                    throw new Exception($"Invalid quantity for product '{cartItem.Product.Name}'");

                if (cartItem.Product.Quantity < cartItem.Quantity)
                    throw new Exception($"Insufficient stock for product '{cartItem.Product.Name}'");

                var unitPrice = cartItem.UnitPriceSnapshot ?? cartItem.Product.Price;
                totalAmount += unitPrice * cartItem.Quantity;
            }

            var order = new Order
            {
                CustomerId = customerId,
                Status = OrderStatus.PROCESSING,
                PaymentMethod = request.PaymentMethod,
                TotalAmount = totalAmount,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow
            };

            await _orderRepository.AddAsync(order, cancellationToken);

            var orderItems = cartItems.Select(ci =>
            {
                var unitPrice = ci.UnitPriceSnapshot ?? ci.Product.Price;

                return new OrderItem
                {
                    OrderId = order.Id,
                    productId = ci.ProductId,
                    Quantity = ci.Quantity,
                    UnitPrice = unitPrice,
                    LineTotal = unitPrice * ci.Quantity
                };
            }).ToList();

            await _orderItemRepository.AddRangeAsync(orderItems, cancellationToken);

            var payment = new Payment
            {
                OrderId = order.Id,
                PaymentMethod = request.PaymentMethod,
                Amount = totalAmount,
                Status = PaymentStatus.PENDING,
                CreatedAt = DateTime.UtcNow
            };

            await _paymentRepository.AddAsync(payment, cancellationToken);

            foreach (var cartItem in cartItems)
            {
                var product = cartItem.Product;

                product.Quantity -= cartItem.Quantity;

                var updated = await _productRepository.Update(product);
                if (!updated)
                    throw new Exception($"Failed to update inventory for product '{product.Name}'");

                var movement = new InventoryMovement
                {
                    ProductId = product.Id,
                    ChangeQty = -cartItem.Quantity,
                    Reason = InventoryMovementReason.ORDER_CREATED,
                    RefOrderId = order.Id,
                    PerformedBy = customerId,
                    CreatedAt = DateTime.UtcNow
                };

                await _inventoryMovementRepository.AddAsync(movement, cancellationToken);
            }

            cart.Status = CartStatus.CHECKED_OUT;
            cart.UpdatedAt = DateTime.UtcNow;
            _cartRepository.Update(cart);

            return new CheckoutResponse
            {
                OrderId = order.Id,
                OrderStatus = order.Status,
                PaymentId = payment.Id,
                PaymentStatus = payment.Status,
                TotalAmount = order.TotalAmount,
                Message = "Checkout completed successfully"
            };
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
                Notes = order.Notes,
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