namespace OrderSystem.Application.Auth.DTOs.Responses
{
    public class ProfileResponse
    {
        public long UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
