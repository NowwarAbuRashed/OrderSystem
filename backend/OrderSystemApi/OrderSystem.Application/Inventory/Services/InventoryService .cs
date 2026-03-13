using AutoMapper;
using OrderSystem.Application.Common.Models;
using OrderSystem.Application.Inventory.DTOs.Requests;
using OrderSystem.Application.Inventory.DTOs.Responses;
using OrderSystem.Application.Inventory.Interfaces;
using OrderSystem.Application.Products.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using OrderSystem.Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventory.Services
{
    public class InventoryService:IInventoryService
    {
        private readonly IInventoryMovementRepository _movementRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        public InventoryService(IInventoryMovementRepository movementRepository, IProductRepository productRepository,IMapper mapper)
        {
            _movementRepository = movementRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }
        public async Task<AdjustInventoryResponse> AdjustInventoryAsync( long productId,AdjustInventoryRequest request,long performedBy,
            CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(productId, cancellationToken);

            if (product == null)
                throw new Exception("Product not found");

            if (request.QuantityDelta.HasValue)
            {
                var newQty = product.Quantity + request.QuantityDelta.Value;

                if (newQty < 0)
                    throw new Exception("Inventory cannot be negative");

                product.Quantity = newQty;
            }

            if (request.MinQuantity.HasValue)
            {
                product.MinQuantity = request.MinQuantity.Value;
            }

            _productRepository.Update(product);

            var movement = new InventoryMovement
            {
                ProductId = product.Id,
                ChangeQty = request.QuantityDelta ?? 0,
                Reason = InventoryMovementReason.MANUAL_ADJUSTMENT,
                PerformedBy = performedBy,
                CreatedAt = DateTime.UtcNow
            };

            await _movementRepository.AddAsync(movement, cancellationToken);

            return new AdjustInventoryResponse
            {
                ProductId = product.Id,
                NewQuantity = product.Quantity,
                NewMinQuantity = product.MinQuantity,
                MovementId = movement.Id,
                MovementReason = movement.Reason.ToString()
            };
        }

        public async Task<PagedResult<InventoryMovementResponse>> GetMovementsAsync(
            InventoryMovementQueryRequest query,
            CancellationToken cancellationToken)
        {
            var (items, total) = await _movementRepository.GetPagedAsync(query, cancellationToken);

            var result = _mapper.Map<List<InventoryMovementResponse>>(items);

            return new PagedResult<InventoryMovementResponse>
            {
                Items = result,
                Page = query.Page,
                PageSize = query.PageSize,
                TotalCount = total
            };
        }
    }
}
