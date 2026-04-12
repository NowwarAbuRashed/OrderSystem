using System.ComponentModel.DataAnnotations;

namespace OrderSystem.Application.Auth.DTOs.Requests
{
    public class UpdateProfileRequest
    {
        [Required(ErrorMessage = "Full Name is required.")]
        [StringLength(100, ErrorMessage = "Full Name cannot exceed 100 characters.")]
        public string? FullName { get; set; }
    }
}
