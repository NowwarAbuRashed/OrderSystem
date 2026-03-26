namespace OrderSystem.Application.ProductImage.DTOs.Requests
{
    public class UpdateProductImageRequest
    {
        public string? ImageUrl { get; set; }
        public string? AltText { get; set; }
        public int? SortOrder { get; set; }
        public bool? IsPrimary { get; set; }
    }

}
