using OrderSystem.Domain.Enums;
namespace OrderSystem.Domain.Entities
{
    public class Product
    {

        public long Id { get; set; }

  
        public string ? Name { get; set; } 

        public string? Description { get; set; }

  
        public decimal Price { get; set; }

  
        public int Quantity { get; set; }


        public int MinQuantity { get; set; }


        public ProductStatus Status { get; set; } 

        public long? CategoryId { get; set; }


     
        public DateTime CreatedAt { get; set; }

       
        public DateTime UpdatedAt { get; set; }

        //Navigation property
        // public Category? Category { get; set; }
        //public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    }
}
