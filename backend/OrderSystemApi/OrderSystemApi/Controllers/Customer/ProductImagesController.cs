using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.ProductImage.DTOs.Requests;
using OrderSystem.Application.ProductImage.Interfaces;

namespace OrderSystem.Api.Controllers.Customer
{


    [Route("api/[controller]")]
    [ApiController]
    public class ProductImagesController : ControllerBase
    {
        readonly IProductImageService _productImageService;
        public ProductImagesController(IProductImageService productImageService)
        {
            _productImageService = productImageService;
        } 
        [HttpGet]
        public async Task<IActionResult> GetImages(long productId, CancellationToken ct)
        {
            var result = await _productImageService.GetImagesAsync(productId, ct);
            return Ok(result);
        }

    }
}
