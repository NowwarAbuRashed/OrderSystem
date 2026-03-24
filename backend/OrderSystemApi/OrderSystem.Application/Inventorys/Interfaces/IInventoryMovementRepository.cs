using OrderSystem.Application.Inventorys.DTOs.Requests;
using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventorys.Interfaces
{
    public interface IInventoryMovementRepository
    {
      public Task AddAsync(InventoryMovement movement,CancellationToken cancellationToken);

       public Task<(List<InventoryMovement> Items, int TotalCount)> GetPagedAsync(InventoryMovementQueryRequest query,CancellationToken cancellationToken);
        Task<(List<Product> Items, int TotalCount)> GetInventoryStatusPagedAsync(
         int page,
         int pageSize,
         CancellationToken cancellationToken);

        Task<(List<Product> Items, int TotalCount)> GetLowStockPagedAsync(
            int page,
            int pageSize,
            CancellationToken cancellationToken);

    }
}
