using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Carts.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using OrderSystem.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Repositories
{
    public class CartRepository: ICartRepository
    {
        private readonly ApplicationDbContext _context;

        public CartRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Cart?> GetActiveCartByCustomerIdAsync(long customerId, CancellationToken ct)
        {
            return await _context.Carts
                .FirstOrDefaultAsync(c => c.CustomerId == customerId && c.Status == CartStatus.ACTIVE, ct);
        }

        public async Task AddAsync(Cart cart, CancellationToken ct)
        {
            await _context.Carts.AddAsync(cart, ct);
            await _context.SaveChangesAsync(ct);
        }

        public void Update(Cart cart)
        {
            _context.Carts.Update(cart);
            _context.SaveChanges();
        }

    }
}
