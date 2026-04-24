using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.ProductImage.DTOs.Requests;
using OrderSystem.Application.ProductImage.Interfaces;

namespace OrderSystem.Api.Controllers.Manager
{
    [Route("api/v1/manager/products/{productId:long}/images")]
    [ApiController]
    [Authorize(Roles = "MANAGER,ADMIN")]
    public class ManagerProductImagesController : ControllerBase
    {
        readonly IProductImageService _productImageService;
        public ManagerProductImagesController(IProductImageService productImageService)
        {
            _productImageService = productImageService;
        }
        [HttpGet]
        public async Task<IActionResult> GetImages(long productId, CancellationToken ct)
        {
            var result = await _productImageService.GetImagesAsync(productId, ct);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddImage(
            [FromRoute] long productId,
            [FromBody] AddProductImageRequest request,
            CancellationToken ct)
        {
            var imageId = await _productImageService.AddImageAsync(productId, request, ct);
            return Ok(new { Id = imageId, Message = "Image added successfully" });
        }

        [HttpPut("{imageId:long}")]
        public async Task<IActionResult> UpdateImage(
            [FromRoute] long productId,
            [FromRoute] long imageId,
            [FromBody] UpdateProductImageRequest request,
            CancellationToken ct)
        {
            var updated = await _productImageService.UpdateImageAsync(imageId, request, ct);
            return Ok(new { Success = updated, Message = "Image updated successfully" });
        }

        [HttpDelete("{imageId:long}")]
        public async Task<IActionResult> DeleteImage(
            [FromRoute] long productId,
            [FromRoute] long imageId,
            CancellationToken ct)
        {
            var deleted = await _productImageService.DeleteImageAsync(imageId, ct);
            return Ok(new { Success = deleted, Message = "Image deleted successfully" });
        }
    }
}
