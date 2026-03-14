using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Products.Interfaces
{
    public interface IProductRepository
    {
        Task<Product?> GetByIdAsync(long id, CancellationToken cancellationToken);
        void Update(Product product);
    }
}
