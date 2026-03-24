using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Carts.Interfaces
{
    public interface ICartItemRepository
    {
        Task<CartItem?> GetByIdAsync(long itemId, CancellationToken ct);
        Task<CartItem?> GetByCartAndProductAsync(long cartId, long productId, CancellationToken ct);
        Task<List<CartItem>> GetByCartIdAsync(long cartId, CancellationToken ct);
        Task AddAsync(CartItem item, CancellationToken ct);
        void Update(CartItem item);
        void Remove(CartItem item);
        void RemoveRange(IEnumerable<CartItem> items);
    }
}
