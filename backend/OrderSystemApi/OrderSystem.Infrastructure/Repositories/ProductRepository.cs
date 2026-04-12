using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Products.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using OrderSystem.Infrastructure.Data;


namespace OrderSystem.Infrastructure.Repositories
{
    public class ProductRepository:IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<long> AddAsync(Product product, CancellationToken ct)
        {
            _context.Products.Add(product);
             await _context.SaveChangesAsync() ;
            return product.Id;

        }

        public async Task<Product?> GetByIdAsync(long id, CancellationToken cancellationToken)
        {
            return await _context.Products.Include(p => p.Images).FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public Task<List<Product>> GetByIdsAsync(IEnumerable<long> ids, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> Update(Product product)
        {
            _context.Products.Update(product);
           return  await _context.SaveChangesAsync()>0;
        }
        public async Task<bool> DeleteAsync(long productId)
        {
            Product? prduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (prduct == null) return false;
            _context.Products.Remove(prduct) ;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<(List<Product> Items, int TotalCount)> GetPagedAsync(
               string? search,
               long? categoryId,
               int page,
               int pageSize,
               CancellationToken ct)
        {
            IQueryable<Product> query = _context.Products
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var trimmedSearch = search.Trim().ToLower();

                query = query.Where(x =>
                    x.Name.ToLower().Contains(trimmedSearch) ||
                    x.Description.ToLower().Contains(trimmedSearch));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(x => x.CategoryId == categoryId.Value);
            }

            var totalCount = await query.CountAsync(ct);

            var items = await query
                .OrderByDescending(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

            return (items, totalCount);
        }
        //public void Update(Product product)
        //{
        //    _context.Products.Update(product);
        //    _context.SaveChanges();
        //}
    }
}
