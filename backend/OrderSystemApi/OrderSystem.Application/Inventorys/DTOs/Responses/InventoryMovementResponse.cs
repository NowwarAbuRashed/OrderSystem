using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventorys.DTOs.Responses
{
    public class InventoryMovementResponse
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int ChangeQty { get; set; }
        public string Reason { get; set; } = string.Empty;
        public long? RefOrderId { get; set; }
        public long? PerformedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
