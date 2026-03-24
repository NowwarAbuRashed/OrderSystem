using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventorys.DTOs.Responses
{
    public class InventoryStatusResponse
    {
        public long ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int MinQuantity { get; set; }
        public string StockStatus { get; set; } = string.Empty;
    }
}
