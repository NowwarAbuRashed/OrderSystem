using OrderSystem.Application.Common.Models;
using OrderSystem.Application.Inventory.DTOs.Requests;
using OrderSystem.Application.Inventory.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventory.Interfaces
{
    public interface IInventoryService
    {
        Task<AdjustInventoryResponse> AdjustInventoryAsync(long productId,AdjustInventoryRequest request,long performedBy,CancellationToken cancellationToken);

        Task<PagedResult<InventoryMovementResponse>> GetMovementsAsync(InventoryMovementQueryRequest query,CancellationToken cancellationToken);
    }
}
