namespace OrderSystem.Application.Admin.DTOs.Responses
{
    public class AdminOrderDto
    {
        public long OrderId { get; set; }
        public string CustomerName { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public int ItemCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
