using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Products.DTOs.Requests
{
    public class ProductQueryRequest
    {
        public string? Search { get; set; }
        public long? CategoryId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

}
