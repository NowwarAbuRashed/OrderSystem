using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Orders.DTOs.Requests;
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
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Order?> GetByIdAsync(long orderId, CancellationToken cancellationToken)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
        }

        public async Task<Order?> GetByIdForCustomerAsync(
            long orderId,
            long customerId,
            CancellationToken cancellationToken)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(
                    o => o.Id == orderId && o.CustomerId == customerId,
                    cancellationToken);
        }

        public async Task<(List<Order> Items, int TotalCount)> GetPagedAsync(
            OrderQueryRequest query,
            CancellationToken cancellationToken)
        {
            var q = _context.Orders
                .AsNoTracking()
                .AsQueryable();

            if (query.Status.HasValue)
            {
                q = q.Where(o => o.Status == query.Status.Value);
            }

            var totalCount = await q.CountAsync(cancellationToken);

            var items = await q
                .OrderByDescending(o => o.CreatedAt)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }

        public async Task<(List<Order> Items, int TotalCount)> GetPagedForCustomerAsync(
            long customerId,
            OrderQueryRequest query,
            CancellationToken cancellationToken)
        {
            var q = _context.Orders
                .AsNoTracking()
                .Where(o => o.CustomerId == customerId)
                .AsQueryable();

            if (query.Status.HasValue)
            {
                q = q.Where(o => o.Status == query.Status.Value);
            }

            var totalCount = await q.CountAsync(cancellationToken);

            var items = await q
                .OrderByDescending(o => o.CreatedAt)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }

        public async Task AddAsync(Order order, CancellationToken cancellationToken)
        {
            await _context.Orders.AddAsync(order, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public void Update(Order order)
        {
            _context.Orders.Update(order);
            _context.SaveChanges();
        }
    }
}
