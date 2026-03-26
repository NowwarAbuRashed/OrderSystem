using OrderSystem.Application.Carts.DTOs.Requests;
using OrderSystem.Application.Carts.DTOs.Responses;
using OrderSystem.Application.Carts.Interfaces;
using OrderSystem.Application.Products.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Carts.Services
{
    public class CartService:ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly ICartItemRepository _cartItemRepository;
        private readonly IProductRepository _productRepository;

        public CartService(
            ICartRepository cartRepository,
            ICartItemRepository cartItemRepository,
            IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
            _productRepository = productRepository;
        }

        public async Task<CartResponse> GetMyCartAsync(long customerId, CancellationToken ct)
        {
            var cart = await GetOrCreateActiveCartAsync(customerId, ct);
            return await BuildCartResponseAsync(cart, ct);
        }

        public async Task<CartResponse> AddItemAsync(long customerId, AddCartItemRequest request, CancellationToken ct)
        {
            if (request.Quantity <= 0)
                throw new Exception("Quantity must be greater than zero");

            var product = await _productRepository.GetByIdAsync(request.ProductId, ct);
            if (product == null)
                throw new Exception("Product not found");

            var cart = await GetOrCreateActiveCartAsync(customerId, ct);

            var existingItem = await _cartItemRepository.GetByCartAndProductAsync(cart.Id, request.ProductId, ct);

            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
                existingItem.UnitPriceSnapshot = product.Price;
                _cartItemRepository.Update(existingItem);
            }
            else
            {
                var item = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = product.Id,
                    Quantity = request.Quantity,
                    UnitPriceSnapshot = product.Price,
                    CreatedAt = DateTime.UtcNow
                };

                await _cartItemRepository.AddAsync(item, ct);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            _cartRepository.Update(cart);

            return await BuildCartResponseAsync(cart, ct);
        }

        public async Task<CartItemResponse> UpdateItemAsync(long customerId, long itemId, UpdateCartItemRequest request, CancellationToken ct)
        {
            if (request.Quantity <= 0)
                throw new Exception("Quantity must be greater than zero");

            var item = await _cartItemRepository.GetByIdAsync(itemId, ct);
            if (item == null)
                throw new Exception("Cart item not found");

            if (item.Cart.CustomerId != customerId || item.Cart.Status != CartStatus.ACTIVE)
                throw new Exception("Cart item does not belong to the active cart");

            item.Quantity = request.Quantity;

            if (item.Product != null)
                item.UnitPriceSnapshot = item.Product.Price;

            _cartItemRepository.Update(item);

            item.Cart.UpdatedAt = DateTime.UtcNow;
            _cartRepository.Update(item.Cart);

            return MapCartItem(item);
        }

        public async Task RemoveItemAsync(long customerId, long itemId, CancellationToken ct)
        {
            var item = await _cartItemRepository.GetByIdAsync(itemId, ct);
            if (item == null)
                throw new Exception("Cart item not found");

            if (item.Cart.CustomerId != customerId || item.Cart.Status != CartStatus.ACTIVE)
                throw new Exception("Cart item does not belong to the active cart");

            _cartItemRepository.Remove(item);

            item.Cart.UpdatedAt = DateTime.UtcNow;
            _cartRepository.Update(item.Cart);
        }

        public async Task ClearCartAsync(long customerId, CancellationToken ct)
        {
            var cart = await _cartRepository.GetActiveCartByCustomerIdAsync(customerId, ct);
            if (cart == null)
                return;

            var items = await _cartItemRepository.GetByCartIdAsync(cart.Id, ct);
            if (items.Count > 0)
            {
                _cartItemRepository.RemoveRange(items);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            _cartRepository.Update(cart);
        }

        private async Task<Cart> GetOrCreateActiveCartAsync(long customerId, CancellationToken ct)
        {
            var cart = await _cartRepository.GetActiveCartByCustomerIdAsync(customerId, ct);

            if (cart != null)
                return cart;

            cart = new Cart
            {
                CustomerId = customerId,
                Status = CartStatus.ACTIVE,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _cartRepository.AddAsync(cart, ct);
            return cart;
        }

        private async Task<CartResponse> BuildCartResponseAsync(Cart cart, CancellationToken ct)
        {
            var items = await _cartItemRepository.GetByCartIdAsync(cart.Id, ct);
            var mappedItems = items.Select(MapCartItem).ToList();

            return new CartResponse
            {
                Id = cart.Id,
                Status = cart.Status.ToString(),
                Items = mappedItems,
                Subtotal = mappedItems.Sum(i => i.LineTotal)
            };
        }

        private static CartItemResponse MapCartItem(CartItem item)
        {
            var unitPrice = item.UnitPriceSnapshot ?? item.Product?.Price ?? 0m;

            return new CartItemResponse
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product?.Name ?? string.Empty,
                UnitPrice = unitPrice,
                Quantity = item.Quantity,
                LineTotal = unitPrice * item.Quantity
            };
        }


    }
}
