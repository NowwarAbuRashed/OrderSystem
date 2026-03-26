using OrderSystem.Application.Orders.DTOs.Requests;
using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Orders.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(long orderId, CancellationToken cancellationToken);

        Task<Order?> GetByIdForCustomerAsync(
            long orderId,
            long customerId,
            CancellationToken cancellationToken);

        Task<(List<Order> Items, int TotalCount)> GetPagedAsync(
            OrderQueryRequest query,
            CancellationToken cancellationToken);

        Task<(List<Order> Items, int TotalCount)> GetPagedForCustomerAsync(
            long customerId,
            OrderQueryRequest query,
            CancellationToken cancellationToken);

        Task AddAsync(Order order, CancellationToken cancellationToken);

        void Update(Order order);
    }
}
