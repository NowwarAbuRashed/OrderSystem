using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Carts.DTOs.Responses
{
    public class CartResponse
    {
        public long Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<CartItemResponse> Items { get; set; } = new();
        public decimal Subtotal { get; set; }

    }
}
