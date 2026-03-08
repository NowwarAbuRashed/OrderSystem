using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Domain.Entities
{
    public  class Category
    {
       
        public long Id { get; set; }

   
        public string ? Name { get; set; } 


        public DateTime CreatedAt { get; set; }

 
        public DateTime UpdatedAt { get; set; }

        // Navigation property
        //public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
