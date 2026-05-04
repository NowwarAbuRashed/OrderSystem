using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.ProductImage.DTOs.Requests;
using OrderSystem.Application.ProductImage.DTOs.Responses;
using OrderSystem.Application.ProductImage.Interfaces;
using OrderSystem.Application.Products.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Repositories
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductImageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductImage>> GetByProductIdAsync(long productId, CancellationToken ct)
        {
            return await _context.ProductImages
                .Where(x => x.ProductId == productId)
                .OrderBy(x => x.SortOrder)
                .Select(x => new ProductImage
                {
                    Id = x.Id,
                    ProductId = x.ProductId,
                    ImageUrl = x.ImageUrl,
                    AltText = x.AltText,
                    SortOrder = x.SortOrder,
                    IsPrimary = x.IsPrimary,
                    CreatedAt = x.CreatedAt,
                })

                .ToListAsync(ct);
        }

        public async Task<ProductImage?> GetByIdAsync(long imageId, CancellationToken ct)
        {
            return await _context.ProductImages
                .Where(x => x.Id == imageId)
                .Select(x => new ProductImage
                {
                    Id = x.Id,
                    ProductId = x.ProductId,
                    ImageUrl = x.ImageUrl,
                    AltText = x.AltText,
                    SortOrder = x.SortOrder,
                    IsPrimary = x.IsPrimary,
                    CreatedAt = x.CreatedAt,
                })
                .FirstOrDefaultAsync(ct);
        }

        public async Task<long> AddAsync(ProductImage image, CancellationToken ct)
        {
            await _context.ProductImages.AddAsync(image, ct);
            await _context.SaveChangesAsync(ct);

            return image.Id;
        }

        public async Task<bool> Update(ProductImage image)
        {
            var existingImage = await _context.ProductImages
                .FirstOrDefaultAsync(x => x.Id == image.Id);

            if (existingImage is null)
                return false;

            existingImage.ImageUrl = image.ImageUrl;
            existingImage.AltText = image.AltText;
            existingImage.SortOrder = image.SortOrder;
            existingImage.IsPrimary = image.IsPrimary;

            _context.ProductImages.Update(existingImage);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Remove(long imageId)
        {
            var existingImage = await _context.ProductImages
                .FirstOrDefaultAsync(x => x.Id == imageId);

            if (existingImage is null)
                return false;

            _context.ProductImages.Remove(existingImage);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
