using OrderSystem.Application.ProductImage.DTOs.Responses;

namespace OrderSystem.Application.Products.DTOs.Responses
{
    public class ProductDetailsResponse
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int MinQuantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public long CategoryId { get; set; }

        //ProductResponse product= new ProductResponse();
        public string Description { get; set; } = string.Empty;
        public List<ProductImageResponse> Images { get; set; } = new();
    }


}
// get all pruct return

