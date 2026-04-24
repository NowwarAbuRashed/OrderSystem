using OrderSystem.Application.Admin.DTOs.Requests;
using OrderSystem.Application.Admin.DTOs.Responses;
using OrderSystem.Application.Common.Models;
using OrderSystem.Domain.Enums;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface IAdminService
    {
        Task<DashboardResponse> GetDashboardAsync(CancellationToken cancellationToken);

        Task<PagedResult<AdminUserDto>> GetUsersAsync(
            int page,
            int pageSize,
            UserRole? role,
            CancellationToken cancellationToken);

        Task UpdateUserRoleAsync(
            long userId,
            UpdateUserRoleRequest request,
            CancellationToken cancellationToken);

        Task UpdateUserStatusAsync(
            long userId,
            UpdateUserStatusRequest request,
            CancellationToken cancellationToken);

        Task<PagedResult<AdminOrderDto>> GetOrdersAsync(
            int page,
            int pageSize,
            OrderStatus? status,
            CancellationToken cancellationToken);

        Task<RevenueReportResponse> GetRevenueReportAsync(
            int days,
            CancellationToken cancellationToken);

        Task<List<ManagerPerformanceDto>> GetManagerPerformanceAsync(CancellationToken cancellationToken);
    }
}
