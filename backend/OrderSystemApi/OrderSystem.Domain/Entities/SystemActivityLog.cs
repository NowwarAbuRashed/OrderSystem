using System;

namespace OrderSystem.Domain.Entities
{
    public class SystemActivityLog
    {
        public long Id { get; set; }
        
        /// <summary>
        /// e.g. "PRODUCT_EDIT", "ORDER_STATUS_CHANGE", "USER_ROLE_CHANGE"
        /// </summary>
        public string ActionType { get; set; } = string.Empty;
        
        /// <summary>
        /// e.g. "Product", "Order", "User"
        /// </summary>
        public string EntityType { get; set; } = string.Empty;
        
        /// <summary>
        /// The ID of the affected entity. Usually long/int, stored as string to support Guids if needed in future.
        /// </summary>
        public string EntityId { get; set; } = string.Empty;
        
        /// <summary>
        /// The ID of the user who performed the action. Can be null if system action.
        /// </summary>
        public long? PerformedByUserId { get; set; }
        
        public User? PerformedByUser { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// JSON payload containing details (e.g. before/after states, changed fields)
        /// </summary>
        public string Details { get; set; } = string.Empty;
    }
}
