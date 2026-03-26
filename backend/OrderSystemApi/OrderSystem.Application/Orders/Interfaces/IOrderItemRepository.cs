using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Orders.Interfaces
{
    public interface IOrderItemRepository
    {
        Task AddRangeAsync(IEnumerable<OrderItem> items, CancellationToken cancellationToken);

        Task<List<OrderItem>> GetByOrderIdAsync(long orderId, CancellationToken cancellationToken);
    }
}
