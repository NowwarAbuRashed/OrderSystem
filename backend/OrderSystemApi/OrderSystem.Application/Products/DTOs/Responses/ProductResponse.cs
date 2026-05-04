using OrderSystem.Application.ProductImage.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace OrderSystem.Application.Products.DTOs.Responses
{
    public  class ProductResponse
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Cost { get; set; }
        public int Quantity { get; set; }
        public int MinQuantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public long CategoryId { get; set; }
        public List<ProductImageResponse> Images { get; set; } = new List<ProductImageResponse>();
    }
}
