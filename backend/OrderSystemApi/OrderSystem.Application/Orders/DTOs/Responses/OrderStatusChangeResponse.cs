using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Orders.DTOs.Responses
{
    public class OrderStatusChangeResponse
    {
        public long OrderId { get; set; }
        public OrderStatus Status { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
