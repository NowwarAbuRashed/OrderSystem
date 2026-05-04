namespace OrderSystem.Application.Products.DTOs.Requests
{
    public class CreateProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Cost { get; set; }
        public int Quantity { get; set; }
        public int MinQuantity { get; set; }
        public long CategoryId { get; set; }
    }

}
