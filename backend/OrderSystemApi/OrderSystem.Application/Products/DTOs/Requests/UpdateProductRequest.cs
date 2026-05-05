namespace OrderSystem.Application.Products.DTOs.Requests
{
    public class UpdateProductRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public decimal? Cost { get; set; }
        public int? MinQuantity { get; set; }
        public string? Status { get; set; }
        public long? CategoryId { get; set; }
    }

}
