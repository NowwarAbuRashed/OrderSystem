using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventorys.DTOs.Responses
{
    public class AdjustInventoryResponse
    {
        public long ProductId { get; set; }
        public int NewQuantity { get; set; }
        public int NewMinQuantity { get; set; }
        public long MovementId { get; set; }
        public string MovementReason { get; set; } = string.Empty;
    }
}
