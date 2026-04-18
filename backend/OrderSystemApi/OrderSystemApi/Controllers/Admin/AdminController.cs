using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Admin.DTOs.Requests;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Enums;

namespace OrderSystem.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin")]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard(CancellationToken cancellationToken)
        {
            var result = await _adminService.GetDashboardAsync(cancellationToken);
            return Ok(result);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] UserRole? role = null,
            CancellationToken cancellationToken = default)
        {
            var result = await _adminService.GetUsersAsync(page, pageSize, role, cancellationToken);
            return Ok(result);
        }

        [HttpPut("users/{userId:long}/role")]
        public async Task<IActionResult> UpdateUserRole(
            long userId,
            [FromBody] UpdateUserRoleRequest request,
            CancellationToken cancellationToken)
        {
            await _adminService.UpdateUserRoleAsync(userId, request, cancellationToken);
            return Ok(new { message = "User role updated successfully" });
        }

        [HttpPut("users/{userId:long}/status")]
        public async Task<IActionResult> UpdateUserStatus(
            long userId,
            [FromBody] UpdateUserStatusRequest request,
            CancellationToken cancellationToken)
        {
            await _adminService.UpdateUserStatusAsync(userId, request, cancellationToken);
            return Ok(new { message = "User status updated successfully" });
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] OrderStatus? status = null,
            CancellationToken cancellationToken = default)
        {
            var result = await _adminService.GetOrdersAsync(page, pageSize, status, cancellationToken);
            return Ok(result);
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueReport(
            [FromQuery] int days = 30,
            CancellationToken cancellationToken = default)
        {
            var result = await _adminService.GetRevenueReportAsync(days, cancellationToken);
            return Ok(result);
        }
    }
}
