using OrderSystem.Application.Categories.Interfaces;
using OrderSystem.Application.Common.Models;
using OrderSystem.Application.ProductImage.DTOs.Responses;
using OrderSystem.Application.Products.DTOs.Requests;
using OrderSystem.Application.Products.DTOs.Responses;
using OrderSystem.Application.Products.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;

namespace OrderSystem.Application.Products.Services;
public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public ProductService(IProductRepository productRepository, ICategoryRepository CategoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository= CategoryRepository;
    }

    public async Task<PagedResult<ProductResponse>> GetProductsAsync(ProductQueryRequest request, CancellationToken ct)
    {
        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;

        var (items, totalCount) = await _productRepository.GetPagedAsync(
            request.Search,
            request.CategoryId,
            page,
            pageSize,
            ct);
        
        return new PagedResult<ProductResponse>
        {
            Items = items.Select(x => new ProductResponse
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price,
                Quantity = x.Quantity,
                MinQuantity = x.MinQuantity,
                Status = x.Status.ToString(),
                CategoryId = x.CategoryId ?? 0,
                Images = x.Images.OrderBy(i => i.SortOrder).Select(i => new ProductImageResponse
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    AltText = i.AltText ?? string.Empty,
                    SortOrder = i.SortOrder,
                    IsPrimary = i.IsPrimary
                }).ToList()
            }).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<ProductDetailsResponse> GetProductByIdAsync(long productId, CancellationToken ct)
    {
        var product = await _productRepository.GetByIdAsync(productId, ct);

        if (product is null)
            throw new KeyNotFoundException($"Product with id '{productId}' was not found.");

        return new ProductDetailsResponse
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Quantity = product.Quantity,
            MinQuantity = product.MinQuantity,
            Status = product.Status.ToString(),
            CategoryId = product.CategoryId??0,
            Images = product.Images.Select(img => new ProductImageResponse
            {
                Id = img.Id,
                ImageUrl = img.ImageUrl
            }).ToList()
        };
    }

    public async Task<long> CreateProductAsync(CreateProductRequest request, CancellationToken ct)
    {

        ValidateCreateRequest(request);
        var Category = await _categoryRepository.GetByIdAsync(request.CategoryId, ct);
        if (Category is null)
            throw new KeyNotFoundException($"Category with id '{request.CategoryId}' was not found.");

        var product = new Product
        {
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            Quantity = request.Quantity,
            MinQuantity = request.MinQuantity,
            CategoryId = request.CategoryId,
            Status = (request.Quantity > 0 && request.Quantity >= request.MinQuantity) ? ProductStatus.ACTIVE : ProductStatus.INACTIVE
        };  

        return await _productRepository.AddAsync(product, ct);
    }

    public async Task UpdateProductAsync(long productId, UpdateProductRequest request, CancellationToken ct)
    {
        var product = await _productRepository.GetByIdAsync(productId, ct);

        if (product is null)
            throw new KeyNotFoundException($"Product with id '{productId}' was not found.");

        if (!string.IsNullOrWhiteSpace(request.Name))
            product.Name = request.Name.Trim();

        if (!string.IsNullOrWhiteSpace(request.Description))
            product.Description = request.Description.Trim();

        if (request.Price.HasValue)
        {
            if (request.Price.Value < 0)
                throw new ArgumentException("Price cannot be negative.");

            product.Price = request.Price.Value;
        }

        if (request.MinQuantity.HasValue)
        {
            if (request.MinQuantity.Value < 0)
                throw new ArgumentException("MinQuantity cannot be negative.");

            product.MinQuantity = request.MinQuantity.Value;
        }

        if (request.CategoryId.HasValue)
            product.CategoryId = request.CategoryId.Value;

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if (Enum.TryParse<ProductStatus>(request.Status.Trim(), true, out var status))
            {
                if (product.Quantity == 0 && status == ProductStatus.ACTIVE)
                {
                    throw new ArgumentException("Cannot set status to Active when current stock is zero.");
                }
                product.Status = status;
            }
            else
            {
                throw new ArgumentException("Invalid status provided.");
            }
        }

        var updated = await _productRepository.Update(product);

        if (!updated)
            throw new Exception("Failed to update product.");
    }

    private static void ValidateProductQueryRequest(ProductQueryRequest request)
    {
        if (request is null)
            throw new ArgumentNullException(nameof(request));

        if (request.Page <= 0)
            throw new ArgumentException("Page must be greater than zero.");

        if (request.PageSize <= 0)
            throw new ArgumentException("PageSize must be greater than zero.");

        if (request.PageSize > 100)
            throw new ArgumentException("PageSize cannot be greater than 100.");

        if (request.CategoryId.HasValue && request.CategoryId.Value <= 0)
            throw new ArgumentException("CategoryId must be greater than zero.");

        if (!string.IsNullOrWhiteSpace(request.Search) && request.Search.Trim().Length > 200)
            throw new ArgumentException("Search text is too long.");
    }

    private static void ValidateCreateRequest(CreateProductRequest request)
    {
        if (request is null)
            throw new ArgumentNullException(nameof(request));

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Product name is required.");

        if (request.Name.Trim().Length > 200)
            throw new ArgumentException("Product name is too long.");

        if (string.IsNullOrWhiteSpace(request.Description))
            throw new ArgumentException("Product description is required.");

        if (request.Price < 0)
            throw new ArgumentException("Price cannot be negative.");

        if (request.Quantity < 0)
            throw new ArgumentException("Quantity cannot be negative.");

        if (request.MinQuantity < 0)
            throw new ArgumentException("MinQuantity cannot be negative.");

        if (request.CategoryId <= 0)
            throw new ArgumentException("CategoryId must be greater than zero.");
    }

    //Validation functions
    private static void ValidateUpdateRequest(UpdateProductRequest request)
    {
        if (request is null)
            throw new ArgumentNullException(nameof(request));

        if (request.Name is not null && string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Name cannot be empty.");

        if (request.Name is not null && request.Name.Trim().Length > 200)
            throw new ArgumentException("Product name is too long.");

        if (request.Description is not null && string.IsNullOrWhiteSpace(request.Description))
            throw new ArgumentException("Description cannot be empty.");

        if (request.Price.HasValue && request.Price.Value < 0)
            throw new ArgumentException("Price cannot be negative.");

        if (request.MinQuantity.HasValue && request.MinQuantity.Value < 0)
            throw new ArgumentException("MinQuantity cannot be negative.");

        if (request.CategoryId.HasValue && request.CategoryId.Value <= 0)
            throw new ArgumentException("CategoryId must be greater than zero.");

        if (request.Status is not null && string.IsNullOrWhiteSpace(request.Status))
            throw new ArgumentException("Status cannot be empty.");
    }

    private static void ValidateProductId(long productId)
    {
        if (productId <= 0)
            throw new ArgumentException("ProductId must be greater than zero.");
    }
}


