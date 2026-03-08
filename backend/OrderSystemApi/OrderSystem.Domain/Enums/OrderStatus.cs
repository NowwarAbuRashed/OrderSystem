using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Enums
{
    public enum OrderStatus
    {
        PROCESSING,
        READY,
        OUT_FOR_DELIVERY,
        DELIVERED
    }
}
