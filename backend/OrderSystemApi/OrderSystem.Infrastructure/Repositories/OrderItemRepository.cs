using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Orders.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddRangeAsync(IEnumerable<OrderItem> items, CancellationToken cancellationToken)
        {
            await _context.OrderItems.AddRangeAsync(items, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<OrderItem>> GetByOrderIdAsync(long orderId, CancellationToken cancellationToken)
        {
            return await _context.OrderItems
                .AsNoTracking()
                .Where(oi => oi.OrderId == orderId)
                .ToListAsync(cancellationToken);
        }
    }
}
