using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Carts.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Repositories
{
    public class CartItemRepository:ICartItemRepository
    {
        private readonly ApplicationDbContext _context;

        public CartItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CartItem?> GetByIdAsync(long itemId, CancellationToken ct)
        {
            return await _context.CartItems
                .Include(ci => ci.Cart)
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == itemId, ct);
        }
        public async Task<CartItem?> GetByCartAndProductAsync(long cartId, long productId, CancellationToken ct)
        {
            return await _context.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId, ct);
        }
        public async Task<List<CartItem>> GetByCartIdAsync(long cartId, CancellationToken ct)
        {
            return await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.CartId == cartId)
                .OrderBy(ci => ci.Id)
                .ToListAsync(ct);
        }
        public async Task AddAsync(CartItem item, CancellationToken ct)
        {
            await _context.CartItems.AddAsync(item, ct);
            await _context.SaveChangesAsync(ct);
        }

        public void Update(CartItem item)
        {
            _context.CartItems.Update(item);
            _context.SaveChanges();
        }

        public void Remove(CartItem item)
        {
            _context.CartItems.Remove(item);
            _context.SaveChanges();
        }

        public void RemoveRange(IEnumerable<CartItem> items)
        {
            _context.CartItems.RemoveRange(items);
            _context.SaveChanges();
        }

    }
}
