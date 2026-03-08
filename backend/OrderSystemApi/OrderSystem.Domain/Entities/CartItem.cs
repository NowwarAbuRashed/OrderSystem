using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Entities
{
    public class CartItem
    {
        public long Id { get; set; }

        public long CartId { get; set; }

        public long ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal? UnitPriceSnapshot { get; set; }

        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        //public Carts Cart { get; set; } = null!;

        //public Products Product { get; set; } = null!;
    }
}
