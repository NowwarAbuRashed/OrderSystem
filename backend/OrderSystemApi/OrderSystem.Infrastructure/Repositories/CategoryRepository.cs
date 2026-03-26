using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Categories.DTOs.Requests;
using OrderSystem.Application.Categories.Interfaces;
using OrderSystem.Application.ProductImage.DTOs.Requests;
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
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllAsync(CancellationToken ct)
        {
            return await _context.Categories.ToListAsync(ct);
        }

        public async Task<Category?> GetByIdAsync(long id, CancellationToken ct)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id, ct);
        }

        public async Task<long> AddAsync(Category category, CancellationToken ct)
        {
            await _context.Categories.AddAsync(category, ct);
            await _context.SaveChangesAsync(ct);

            return category.Id;
        }

        public async Task<bool> Update(Category category)
        {
            _context.Categories.Update(category);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Remove(Category category)
        {
            _context.Categories.Remove(category);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
