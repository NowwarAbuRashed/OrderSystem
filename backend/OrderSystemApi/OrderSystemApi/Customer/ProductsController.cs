using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Products.DTOs.Requests;
using OrderSystem.Application.Products.Interfaces;

namespace OrderSystem.Api.Customer;

[ApiController]
[Route("api/v1/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] ProductQueryRequest request,
        CancellationToken ct)
    {
        var result = await _productService.GetProductsAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("{productId:long}")]
    public async Task<IActionResult> GetProductById(
        [FromRoute] long productId,
        CancellationToken ct)
    {
        var result = await _productService.GetProductByIdAsync(productId, ct);
        return Ok(result);
    }

    [HttpGet("{productId:long}/images")]
    public async Task<IActionResult> GetProductImages(
        [FromRoute] long productId,
        CancellationToken ct)
    {
        var result = await _productService.GetProductByIdAsync(productId, ct);
        return Ok(result.Images);
    }
}