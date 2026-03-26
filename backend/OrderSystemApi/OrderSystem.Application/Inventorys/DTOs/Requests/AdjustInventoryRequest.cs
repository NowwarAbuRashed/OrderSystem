using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Inventorys.DTOs.Requests
{
    public class AdjustInventoryRequest
    {
        public int? QuantityDelta { get; set; }
        public int? MinQuantity { get; set; }

    }
}
