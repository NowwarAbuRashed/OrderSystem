using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Entities
{
    public class OrderItem
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public long productId {  get; set; }
        public int Quantity {  get; set; }
        public decimal UnitPrice { get; set; }

        public decimal LineTotal { get; set; }

        // Navigation Properties
        //public Order Order { get; set; }

        //public Product Product { get; set; }
    }
}
