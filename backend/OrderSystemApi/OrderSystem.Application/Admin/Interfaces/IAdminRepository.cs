using OrderSystem.Application.Admin.DTOs.Responses;
using OrderSystem.Application.Common.Models;
using OrderSystem.Domain.Enums;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface IAdminRepository
    {
        // Dashboard
        Task<int> GetTotalOrdersAsync(CancellationToken cancellationToken);
        Task<int> GetOrdersTodayAsync(CancellationToken cancellationToken);
        Task<decimal> GetTotalRevenueAsync(CancellationToken cancellationToken);
        Task<decimal> GetRevenueTodayAsync(CancellationToken cancellationToken);
        Task<int> GetTotalUsersAsync(CancellationToken cancellationToken);
        Task<int> GetNewUsersTodayAsync(CancellationToken cancellationToken);
        Task<int> GetLowStockCountAsync(CancellationToken cancellationToken);
        Task<int> GetOutOfStockCountAsync(CancellationToken cancellationToken);
        Task<Dictionary<string, int>> GetOrdersByStatusAsync(CancellationToken cancellationToken);
        Task<Dictionary<string, decimal>> GetRevenueByPaymentMethodAsync(CancellationToken cancellationToken);
        Task<List<RecentOrderDto>> GetRecentOrdersAsync(int count, CancellationToken cancellationToken);

        // Users
        Task<PagedResult<AdminUserDto>> GetUsersPagedAsync(int page, int pageSize, UserRole? role, CancellationToken cancellationToken);
        Task<Domain.Entities.User?> GetUserByIdAsync(long userId, CancellationToken cancellationToken);
        Task UpdateUserAsync(Domain.Entities.User user, CancellationToken cancellationToken);

        // Orders
        Task<PagedResult<AdminOrderDto>> GetOrdersPagedAsync(int page, int pageSize, OrderStatus? status, CancellationToken cancellationToken);

        // Revenue
        Task<decimal> GetRevenuePendingAsync(CancellationToken cancellationToken);
        Task<int> GetTotalPaymentsAsync(CancellationToken cancellationToken);
        Task<int> GetPaidCountAsync(CancellationToken cancellationToken);
        Task<int> GetPendingCountAsync(CancellationToken cancellationToken);
        Task<int> GetFailedCountAsync(CancellationToken cancellationToken);
        Task<List<DailyRevenueDto>> GetDailyRevenueAsync(int days, CancellationToken cancellationToken);
    }
}
