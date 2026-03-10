using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace OrderSystem.Domain.Entities
{
    public class ProductImage
    {
      
        public long Id { get; set; }

  
        public long ProductId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;


        public string? AltText { get; set; }


        public int SortOrder { get; set; }

       
        public bool IsPrimary { get; set; } 

        public DateTime CreatedAt { get; set; }

      // Navigation Property
        public Product Product { get; set; }

    }
}
