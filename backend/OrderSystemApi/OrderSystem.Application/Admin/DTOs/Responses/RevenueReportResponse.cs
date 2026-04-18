namespace OrderSystem.Application.Admin.DTOs.Responses
{
    public class RevenueReportResponse
    {
        public decimal TotalRevenue { get; set; }
        public decimal RevenuePaid { get; set; }
        public decimal RevenuePending { get; set; }
        public int TotalPayments { get; set; }
        public int PaidCount { get; set; }
        public int PendingCount { get; set; }
        public int FailedCount { get; set; }
        public Dictionary<string, decimal> RevenueByMethod { get; set; } = new();
        public List<DailyRevenueDto> DailyRevenue { get; set; } = new();
    }

    public class DailyRevenueDto
    {
        public string Date { get; set; } = null!;
        public decimal Amount { get; set; }
        public int OrderCount { get; set; }
    }
}
