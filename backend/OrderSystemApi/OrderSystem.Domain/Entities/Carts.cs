using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Entities
{
    public class Carts
    {
        public long Id { get; set; }

        public long CustomerId { get; set; }

        public CartStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation properties

        //public Users Customer { get; set; } = null!;

        //public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
