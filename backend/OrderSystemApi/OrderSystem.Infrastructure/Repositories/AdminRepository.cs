using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Admin.DTOs.Responses;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Application.Common.Models;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using OrderSystem.Infrastructure.Data;

namespace OrderSystem.Infrastructure.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public AdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // ── Dashboard ──

        public async Task<int> GetTotalOrdersAsync(CancellationToken cancellationToken)
        {
            return await _context.Orders.CountAsync(cancellationToken);
        }

        public async Task<int> GetOrdersTodayAsync(CancellationToken cancellationToken)
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Orders
                .Where(o => o.CreatedAt >= today)
                .CountAsync(cancellationToken);
        }

        public async Task<decimal> GetTotalRevenueAsync(CancellationToken cancellationToken)
        {
            return await _context.Payments
                .Where(p => p.Status == PaymentStatus.PAID)
                .SumAsync(p => p.Amount, cancellationToken);
        }

        public async Task<decimal> GetRevenueTodayAsync(CancellationToken cancellationToken)
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Payments
                .Where(p => p.Status == PaymentStatus.PAID && p.PaidAt >= today)
                .SumAsync(p => p.Amount, cancellationToken);
        }

        public async Task<decimal> GetTotalCostAsync(CancellationToken cancellationToken)
        {
            return await _context.OrderItems
                .Where(oi => oi.Order.Payments != null && oi.Order.Payments.Status == PaymentStatus.PAID)
                .SumAsync(oi => oi.UnitCost * oi.Quantity, cancellationToken);
        }

        public async Task<decimal> GetCostTodayAsync(CancellationToken cancellationToken)
        {
            var today = DateTime.UtcNow.Date;
            return await _context.OrderItems
                .Where(oi => oi.Order.Payments != null && oi.Order.Payments.Status == PaymentStatus.PAID && oi.Order.CreatedAt >= today)
                .SumAsync(oi => oi.UnitCost * oi.Quantity, cancellationToken);
        }

        public async Task<int> GetTotalUsersAsync(CancellationToken cancellationToken)
        {
            return await _context.Users.CountAsync(cancellationToken);
        }

        public async Task<int> GetNewUsersTodayAsync(CancellationToken cancellationToken)
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Users
                .Where(u => u.CreatedAt >= today)
                .CountAsync(cancellationToken);
        }

        public async Task<int> GetLowStockCountAsync(CancellationToken cancellationToken)
        {
            return await _context.Products
                .Where(p => p.Quantity > 0 && p.Quantity <= p.MinQuantity)
                .CountAsync(cancellationToken);
        }

        public async Task<int> GetOutOfStockCountAsync(CancellationToken cancellationToken)
        {
            return await _context.Products
                .Where(p => p.Quantity <= 0)
                .CountAsync(cancellationToken);
        }

        public async Task<Dictionary<string, int>> GetOrdersByStatusAsync(CancellationToken cancellationToken)
        {
            var result = await _context.Orders
                .GroupBy(o => o.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync(cancellationToken);

            return result.ToDictionary(x => x.Status.ToString(), x => x.Count);
        }

        public async Task<Dictionary<string, decimal>> GetRevenueByPaymentMethodAsync(CancellationToken cancellationToken)
        {
            var result = await _context.Payments
                .Where(p => p.Status == PaymentStatus.PAID)
                .GroupBy(p => p.PaymentMethod)
                .Select(g => new { Method = g.Key, Total = g.Sum(p => p.Amount) })
                .ToListAsync(cancellationToken);

            return result.ToDictionary(x => x.Method.ToString(), x => x.Total);
        }

        public async Task<List<RecentOrderDto>> GetRecentOrdersAsync(int count, CancellationToken cancellationToken)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.CreatedAt)
                .Take(count)
                .Select(o => new RecentOrderDto
                {
                    OrderId = o.Id,
                    CustomerName = o.Customer.FullName,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status.ToString(),
                    PaymentMethod = o.PaymentMethod.ToString(),
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync(cancellationToken);
        }

        // ── Users ──

        public async Task<PagedResult<AdminUserDto>> GetUsersPagedAsync(
            int page, int pageSize, UserRole? role, CancellationToken cancellationToken)
        {
            var query = _context.Users.AsNoTracking().AsQueryable();

            if (role.HasValue)
                query = query.Where(u => u.Role == role.Value);

            var totalCount = await query.CountAsync(cancellationToken);

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new AdminUserDto
                {
                    UserId = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role.ToString(),
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    OrderCount = u.Orders.Count
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<AdminUserDto>
            {
                Items = users,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<User?> GetUserByIdAsync(long userId, CancellationToken cancellationToken)
        {
            return await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
        }

        public async Task UpdateUserAsync(User user, CancellationToken cancellationToken)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellationToken);
        }

        // ── Orders ──

        public async Task<PagedResult<AdminOrderDto>> GetOrdersPagedAsync(
            int page, int pageSize, OrderStatus? status, CancellationToken cancellationToken)
        {
            var query = _context.Orders
                .AsNoTracking()
                .Include(o => o.Customer)
                .Include(o => o.Payments)
                .Include(o => o.OrderItems)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(o => o.Status == status.Value);

            var totalCount = await query.CountAsync(cancellationToken);

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new AdminOrderDto
                {
                    OrderId = o.Id,
                    CustomerName = o.Customer.FullName,
                    Status = o.Status.ToString(),
                    PaymentMethod = o.PaymentMethod.ToString(),
                    PaymentStatus = o.Payments != null ? o.Payments.Status.ToString() : "N/A",
                    TotalAmount = o.TotalAmount,
                    ItemCount = o.OrderItems.Count,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<AdminOrderDto>
            {
                Items = orders,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        // ── Revenue ──

        public async Task<decimal> GetRevenuePendingAsync(CancellationToken cancellationToken)
        {
            return await _context.Payments
                .Where(p => p.Status == PaymentStatus.PENDING)
                .SumAsync(p => p.Amount, cancellationToken);
        }

        public async Task<int> GetTotalPaymentsAsync(CancellationToken cancellationToken)
        {
            return await _context.Payments.CountAsync(cancellationToken);
        }

        public async Task<int> GetPaidCountAsync(CancellationToken cancellationToken)
        {
            return await _context.Payments.CountAsync(p => p.Status == PaymentStatus.PAID, cancellationToken);
        }

        public async Task<int> GetPendingCountAsync(CancellationToken cancellationToken)
        {
            return await _context.Payments.CountAsync(p => p.Status == PaymentStatus.PENDING, cancellationToken);
        }

        public async Task<int> GetFailedCountAsync(CancellationToken cancellationToken)
        {
            return await _context.Payments.CountAsync(p => p.Status == PaymentStatus.FAILED, cancellationToken);
        }

        public async Task<List<DailyRevenueDto>> GetDailyRevenueAsync(int days, CancellationToken cancellationToken)
        {
            var fromDate = DateTime.UtcNow.Date.AddDays(-days);

            var orders = await _context.Orders
                .Where(o => o.CreatedAt >= fromDate)
                .Select(o => new { o.CreatedAt, o.TotalAmount })
                .ToListAsync(cancellationToken);

            return orders
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new DailyRevenueDto
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Amount = g.Sum(o => o.TotalAmount),
                    OrderCount = g.Count()
                })
                .OrderBy(d => d.Date)
                .ToList();
        }

        // ── Manager Performance ──

        public async Task<List<ManagerPerformanceDto>> GetManagerPerformanceAsync(CancellationToken cancellationToken)
        {
            // Get all managers
            var managers = await _context.Users
                .Where(u => u.Role == UserRole.MANAGER && u.IsActive)
                .ToListAsync(cancellationToken);

            // Get order-related activity logs by managers
            var managerIds = managers.Select(m => m.Id).ToList();
            var activityLogs = await _context.SystemActivityLogs
                .Where(a => a.PerformedByUserId != null
                    && managerIds.Contains(a.PerformedByUserId.Value)
                    && a.EntityType == "Order")
                .ToListAsync(cancellationToken);

            var result = managers.Select(m =>
            {
                var managerLogs = activityLogs.Where(a => a.PerformedByUserId == m.Id).ToList();
                return new ManagerPerformanceDto
                {
                    ManagerId = m.Id,
                    ManagerName = m.FullName,
                    Email = m.Email,
                    OrdersProcessed = managerLogs.Select(a => a.EntityId).Distinct().Count(),
                    AverageProcessingTimeMinutes = 0, // Could be calculated if we track start/end
                    LastActiveAt = managerLogs.Any() ? managerLogs.Max(a => a.Timestamp) : null
                };
            })
            .OrderByDescending(m => m.OrdersProcessed)
            .ToList();

            return result;
        }
    }
}
