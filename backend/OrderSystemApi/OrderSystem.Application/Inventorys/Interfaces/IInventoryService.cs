using OrderSystem.Application.Common.Models;
using OrderSystem.Application.Inventorys.DTOs.Requests;
using OrderSystem.Application.Inventorys.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventorys.Interfaces
{
    public interface IInventoryService
    {
        Task<AdjustInventoryResponse> AdjustInventoryAsync(long productId,AdjustInventoryRequest request,long performedBy,CancellationToken cancellationToken);

        Task<PagedResult<InventoryMovementResponse>> GetMovementsAsync(InventoryMovementQueryRequest query,CancellationToken cancellationToken);

        Task<PagedResult<InventoryStatusResponse>> GetInventoryStatusAsync(
           int page,
           int pageSize,
           CancellationToken cancellationToken);

        Task<PagedResult<LowStockProductResponse>> GetLowStockAsync(
            int page,
            int pageSize,
            CancellationToken cancellationToken);

    }
}
