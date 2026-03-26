namespace OrderSystem.Application.ProductImage.DTOs.Requests
{
    public class AddProductImageRequest
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string AltText { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public bool IsPrimary { get; set; }
    }

}
