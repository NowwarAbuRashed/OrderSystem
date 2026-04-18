using OrderSystem.Application.Admin.DTOs.Requests;
using OrderSystem.Application.Admin.DTOs.Responses;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Application.Common.Models;
using OrderSystem.Domain.Enums;

namespace OrderSystem.Application.Admin.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<DashboardResponse> GetDashboardAsync(CancellationToken cancellationToken)
        {
            var totalOrders = await _adminRepository.GetTotalOrdersAsync(cancellationToken);
            var ordersToday = await _adminRepository.GetOrdersTodayAsync(cancellationToken);
            var totalRevenue = await _adminRepository.GetTotalRevenueAsync(cancellationToken);
            var revenueToday = await _adminRepository.GetRevenueTodayAsync(cancellationToken);
            var totalUsers = await _adminRepository.GetTotalUsersAsync(cancellationToken);
            var newUsersToday = await _adminRepository.GetNewUsersTodayAsync(cancellationToken);
            var lowStockCount = await _adminRepository.GetLowStockCountAsync(cancellationToken);
            var outOfStockCount = await _adminRepository.GetOutOfStockCountAsync(cancellationToken);
            var ordersByStatus = await _adminRepository.GetOrdersByStatusAsync(cancellationToken);
            var revenueByMethod = await _adminRepository.GetRevenueByPaymentMethodAsync(cancellationToken);
            var recentOrders = await _adminRepository.GetRecentOrdersAsync(5, cancellationToken);

            return new DashboardResponse
            {
                TotalOrders = totalOrders,
                OrdersToday = ordersToday,
                TotalRevenue = totalRevenue,
                RevenueToday = revenueToday,
                TotalUsers = totalUsers,
                NewUsersToday = newUsersToday,
                LowStockCount = lowStockCount,
                OutOfStockCount = outOfStockCount,
                OrdersByStatus = ordersByStatus,
                RevenueByPaymentMethod = revenueByMethod,
                RecentOrders = recentOrders
            };
        }

        public async Task<PagedResult<AdminUserDto>> GetUsersAsync(
            int page, int pageSize, UserRole? role, CancellationToken cancellationToken)
        {
            return await _adminRepository.GetUsersPagedAsync(page, pageSize, role, cancellationToken);
        }

        public async Task UpdateUserRoleAsync(
            long userId, UpdateUserRoleRequest request, CancellationToken cancellationToken)
        {
            var user = await _adminRepository.GetUserByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new Exception("User not found");

            if (user.Role == UserRole.ADMIN)
                throw new Exception("Cannot change the role of an admin user");

            if (!Enum.TryParse<UserRole>(request.Role, true, out var newRole))
                throw new Exception("Invalid role");

            if (newRole == UserRole.ADMIN)
                throw new Exception("Cannot promote a user to admin");

            user.Role = newRole;
            user.UpdatedAt = DateTime.UtcNow;

            await _adminRepository.UpdateUserAsync(user, cancellationToken);
        }

        public async Task UpdateUserStatusAsync(
            long userId, UpdateUserStatusRequest request, CancellationToken cancellationToken)
        {
            var user = await _adminRepository.GetUserByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new Exception("User not found");

            if (user.Role == UserRole.ADMIN)
                throw new Exception("Cannot deactivate an admin user");

            user.IsActive = request.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _adminRepository.UpdateUserAsync(user, cancellationToken);
        }

        public async Task<PagedResult<AdminOrderDto>> GetOrdersAsync(
            int page, int pageSize, OrderStatus? status, CancellationToken cancellationToken)
        {
            return await _adminRepository.GetOrdersPagedAsync(page, pageSize, status, cancellationToken);
        }

        public async Task<RevenueReportResponse> GetRevenueReportAsync(
            int days, CancellationToken cancellationToken)
        {
            var totalRevenue = await _adminRepository.GetTotalRevenueAsync(cancellationToken);
            var revenuePending = await _adminRepository.GetRevenuePendingAsync(cancellationToken);
            var totalPayments = await _adminRepository.GetTotalPaymentsAsync(cancellationToken);
            var paidCount = await _adminRepository.GetPaidCountAsync(cancellationToken);
            var pendingCount = await _adminRepository.GetPendingCountAsync(cancellationToken);
            var failedCount = await _adminRepository.GetFailedCountAsync(cancellationToken);
            var revenueByMethod = await _adminRepository.GetRevenueByPaymentMethodAsync(cancellationToken);
            var dailyRevenue = await _adminRepository.GetDailyRevenueAsync(days, cancellationToken);

            return new RevenueReportResponse
            {
                TotalRevenue = totalRevenue,
                RevenuePaid = totalRevenue,
                RevenuePending = revenuePending,
                TotalPayments = totalPayments,
                PaidCount = paidCount,
                PendingCount = pendingCount,
                FailedCount = failedCount,
                RevenueByMethod = revenueByMethod,
                DailyRevenue = dailyRevenue
            };
        }

        public async Task<List<DTOs.Responses.ManagerPerformanceDto>> GetManagerPerformanceAsync(CancellationToken cancellationToken)
        {
            return await _adminRepository.GetManagerPerformanceAsync(cancellationToken);
        }
    }
}
