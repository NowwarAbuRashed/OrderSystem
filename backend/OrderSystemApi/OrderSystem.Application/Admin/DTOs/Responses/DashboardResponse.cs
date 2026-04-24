namespace OrderSystem.Application.Admin.DTOs.Responses
{
    public class DashboardResponse
    {
        public int TotalOrders { get; set; }
        public int OrdersToday { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal RevenueToday { get; set; }
        public int TotalUsers { get; set; }
        public int NewUsersToday { get; set; }
        public int LowStockCount { get; set; }
        public int OutOfStockCount { get; set; }
        public Dictionary<string, int> OrdersByStatus { get; set; } = new();
        public Dictionary<string, decimal> RevenueByPaymentMethod { get; set; } = new();
        public List<RecentOrderDto> RecentOrders { get; set; } = new();
    }

    public class RecentOrderDto
    {
        public long OrderId { get; set; }
        public string CustomerName { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
