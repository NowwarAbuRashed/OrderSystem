using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Orders.DTOs.Requests
{
    public class CheckoutRequest
    {
        public string? Notes { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
}
