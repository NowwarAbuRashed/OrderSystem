using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Inventorys.DTOs.Requests;
using OrderSystem.Application.Inventorys.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Infrastructure.Data;
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


        public async Task<(List<Product> Items, int TotalCount)> GetInventoryStatusPagedAsync(
           int page,
           int pageSize,
           CancellationToken cancellationToken)
        {
            var query = _context.Products
                .AsNoTracking()
                .OrderBy(p => p.Name);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }

        public async Task<(List<Product> Items, int TotalCount)> GetLowStockPagedAsync(
            int page,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var query = _context.Products
                .AsNoTracking()
                .Where(p => p.Quantity <= p.MinQuantity)
                .OrderBy(p => p.Quantity)
                .ThenBy(p => p.Name);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }


    }
}
