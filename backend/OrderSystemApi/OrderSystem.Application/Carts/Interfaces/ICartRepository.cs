using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Application.Carts.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart?> GetActiveCartByCustomerIdAsync(long customerId, CancellationToken ct);
        Task AddAsync(Cart cart, CancellationToken ct);
        void Update(Cart cart);
    }
}
