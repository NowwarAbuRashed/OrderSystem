using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Entities
{
    public class Payment
    {
        public long Id { get; set; }

        public long OrderId { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public decimal Amount { get; set; }

        public PaymentStatus Status { get; set; }

        public string? TransactionRef { get; set; }

        public DateTime? PaidAt { get; set; }

        public DateTime CreatedAt { get; set; }

        // Navigation
        public Order Order { get; set; }
    }
}
