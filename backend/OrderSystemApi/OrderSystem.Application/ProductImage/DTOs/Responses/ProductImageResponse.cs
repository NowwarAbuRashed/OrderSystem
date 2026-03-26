namespace OrderSystem.Application.ProductImage.DTOs.Responses
{
    public class ProductImageResponse
    {
        public long Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string AltText { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public bool IsPrimary { get; set; }
    }
}
