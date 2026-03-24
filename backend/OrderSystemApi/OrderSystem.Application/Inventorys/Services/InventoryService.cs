using AutoMapper;
using OrderSystem.Application.Common.Models;
using OrderSystem.Application.Inventorys.DTOs.Requests;
using OrderSystem.Application.Inventorys.DTOs.Responses;
using OrderSystem.Application.Inventorys.Interfaces;
using OrderSystem.Application.Products.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventorys.Services
{
    public class InventoryService:IInventoryService
    {
        private readonly IProductRepository _productRepository;
        private readonly IInventoryMovementRepository _movementRepository;
        private readonly IMapper _mapper;

        public InventoryService(
            IProductRepository productRepository,
            IInventoryMovementRepository movementRepository,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _movementRepository = movementRepository;
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
                if (request.MinQuantity.Value < 0)
                    throw new Exception("MinQuantity cannot be negative");
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

        public async Task<PagedResult<InventoryStatusResponse>> GetInventoryStatusAsync(
           int page,
           int pageSize,
           CancellationToken cancellationToken)
        {
            var (items, total) = await _movementRepository.GetInventoryStatusPagedAsync(
                page,
                pageSize,
                cancellationToken);

            var result = items.Select(p => new InventoryStatusResponse
            {
                ProductId = p.Id,
                Name = p.Name,
                Quantity = p.Quantity,
                MinQuantity = p.MinQuantity,
                StockStatus = GetStockStatus(p.Quantity, p.MinQuantity)
            }).ToList();

            return new PagedResult<InventoryStatusResponse>
            {
                Items = result,
                Page = page,
                PageSize = pageSize,
                TotalCount = total
            };
        }

        public async Task<PagedResult<LowStockProductResponse>> GetLowStockAsync(
            int page,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var (items, total) = await _movementRepository.GetLowStockPagedAsync(
                page,
                pageSize,
                cancellationToken);

            var result = items.Select(p => new LowStockProductResponse
            {
                ProductId = p.Id,
                Name = p.Name,
                Quantity = p.Quantity,
                MinQuantity = p.MinQuantity,
                StockStatus = GetStockStatus(p.Quantity, p.MinQuantity)
            }).ToList();

            return new PagedResult<LowStockProductResponse>
            {
                Items = result,
                Page = page,
                PageSize = pageSize,
                TotalCount = total
            };
        }

        private static string GetStockStatus(int quantity, int minQuantity)
        {
            if (quantity == 0) return "OUT_OF_STOCK";
            if (quantity <= minQuantity) return "LOW";
            return "NORMAL";
        }

    }
}
