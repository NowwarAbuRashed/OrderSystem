namespace OrderSystem.Application.Admin.DTOs.Responses
{
    public class ManagerPerformanceDto
    {
        public long ManagerId { get; set; }
        public string ManagerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int OrdersProcessed { get; set; }
        public double AverageProcessingTimeMinutes { get; set; }
        public DateTime? LastActiveAt { get; set; }
    }
}
