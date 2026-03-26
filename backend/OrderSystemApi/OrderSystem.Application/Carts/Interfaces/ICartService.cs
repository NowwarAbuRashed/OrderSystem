using OrderSystem.Application.Carts.DTOs.Requests;
using OrderSystem.Application.Carts.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Carts.Interfaces
{
    public interface ICartService
    {
        Task<CartResponse> GetMyCartAsync(long customerId, CancellationToken ct);
        Task<CartResponse> AddItemAsync(long customerId, AddCartItemRequest request, CancellationToken ct);
        Task<CartItemResponse> UpdateItemAsync(long customerId, long itemId, UpdateCartItemRequest request, CancellationToken ct);
        Task RemoveItemAsync(long customerId, long itemId, CancellationToken ct);
        Task ClearCartAsync(long customerId, CancellationToken ct);
    }
}
