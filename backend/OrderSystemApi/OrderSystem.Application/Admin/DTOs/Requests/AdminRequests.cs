namespace OrderSystem.Application.Admin.DTOs.Requests
{
    public class UpdateUserRoleRequest
    {
        public string Role { get; set; } = null!;
    }

    public class UpdateUserStatusRequest
    {
        public bool IsActive { get; set; }
    }
}
