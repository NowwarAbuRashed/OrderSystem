using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Entities
{
    public class SystemNotification
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string NotificationType { get; set; } = string.Empty; // e.g. "NEW_ORDER", "LOW_STOCK", "FAILED_PAYMENT"
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? RelatedEntityType { get; set; } // e.g. "Order", "Product"
        public string? RelatedEntityId { get; set; }
    }
}
