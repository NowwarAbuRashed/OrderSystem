using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Entities
{
    public class InventoryMovement
    {
        public long Id { get; set; }

        public long ProductId { get; set; }

        public int ChangeQty { get; set; }

        public InventoryMovementReason Reason { get; set; }

        public long? RefOrderId { get; set; }

        public long? PerformedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        // Navigation

        //public Product Product { get; set; }

        //public Orders? RefOrder { get; set; }

        //public User? PerformedByUser { get; set; }

    }
}
