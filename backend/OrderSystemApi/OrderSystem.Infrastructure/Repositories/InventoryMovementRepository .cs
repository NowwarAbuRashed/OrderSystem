using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Inventory.DTOs.Requests;
using OrderSystem.Domain.Entities;
using OrderSystem.Infrastructure.Data;
using OrderSystem.Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Repositories
{
    public class InventoryMovementRepository:IInventoryMovementRepository
    {
        private readonly ApplicationDbContext _context;

        public InventoryMovementRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(InventoryMovement movement,CancellationToken cancellationToken)
        {
            await _context.InventoryMovements.AddAsync(movement, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        public async Task<(List<InventoryMovement> Items, int TotalCount)> GetPagedAsync(InventoryMovementQueryRequest query,CancellationToken cancellationToken)
        {
            var q = _context.InventoryMovements
                   .Include(x => x.Product)
                   .AsNoTracking()
                   .AsQueryable();

            if (query.ProductId.HasValue)
                q = q.Where(x => x.ProductId == query.ProductId.Value);

            if (query.From.HasValue)
                q = q.Where(x => x.CreatedAt >= query.From.Value);

            if (query.To.HasValue)
                q = q.Where(x => x.CreatedAt <= query.To.Value);

            var totalCount = await q.CountAsync(cancellationToken);

            var items = await q
               .OrderByDescending(x => x.CreatedAt)
               .Skip((query.Page - 1) * query.PageSize)
               .Take(query.PageSize)
               .ToListAsync(cancellationToken);

            return (items, totalCount);

        }

    }
}
