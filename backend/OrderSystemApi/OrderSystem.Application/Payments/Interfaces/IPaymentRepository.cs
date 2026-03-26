using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Payments.Interfaces
{
    public interface IPaymentRepository
    {
        Task<Payment?> GetByOrderIdAsync(long orderId, CancellationToken cancellationToken);

        Task AddAsync(Payment payment, CancellationToken cancellationToken);

        void Update(Payment payment);
    }
}
