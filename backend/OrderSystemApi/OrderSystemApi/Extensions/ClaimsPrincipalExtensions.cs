using System.Security.Claims;

namespace OrderSystem.Api.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static long GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!long.TryParse(value, out var userId))
                throw new UnauthorizedAccessException("Invalid token");

            return userId;
        }

        public static string GetUserRole(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Role)
                   ?? throw new UnauthorizedAccessException("Role claim is missing");
        }
    }
}