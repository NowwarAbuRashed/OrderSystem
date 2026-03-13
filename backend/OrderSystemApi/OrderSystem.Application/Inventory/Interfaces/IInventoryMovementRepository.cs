using OrderSystem.Application.Inventory.DTOs.Requests;
using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Interfaces
{
    public interface IInventoryMovementRepository
    {
      public Task AddAsync(InventoryMovement movement,CancellationToken cancellationToken);

       public Task<(List<InventoryMovement> Items, int TotalCount)> GetPagedAsync(InventoryMovementQueryRequest query,CancellationToken cancellationToken);

    }
}
