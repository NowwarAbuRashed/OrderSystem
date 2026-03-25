using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Orders.DTOs.Responses
{
    public class CheckoutResponse
    {
        public long OrderId { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public long PaymentId { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
