using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Products.DTOs.Requests;
using OrderSystem.Application.Products.DTOs.Responses;
using OrderSystem.Application.Products.Interfaces;

namespace OrderSystem.API.Controllers.v1;

[ApiController]
[Route("api/v1/manager/products")]
public class ManagerProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ManagerProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct(
        [FromBody] CreateProductRequest request,
        CancellationToken ct)
    {
        var productId = await _productService.CreateProductAsync(request, ct);

        return Ok(new IdResponse
        {
            Id = productId
        });
    }

    [HttpPatch("{productId:long}")]
    public async Task<IActionResult> UpdateProduct(
        [FromRoute] long productId,
        [FromBody] UpdateProductRequest request,
        CancellationToken ct)
    {
        await _productService.UpdateProductAsync(productId, request, ct);
        return NoContent();
    }
}