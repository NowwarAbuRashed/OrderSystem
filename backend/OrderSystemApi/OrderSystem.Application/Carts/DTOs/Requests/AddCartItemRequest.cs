using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Carts.DTOs.Requests
{
    public class AddCartItemRequest
    {
        public long ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
