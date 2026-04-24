using OrderSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface ISystemNotificationRepository
    {
        Task<long> AddAsync(SystemNotification notification, CancellationToken ct);
        Task<List<SystemNotification>> GetUnreadAsync(int limit, CancellationToken ct);
        Task<List<SystemNotification>> GetRecentAsync(int limit, CancellationToken ct);
        Task<SystemNotification?> GetByIdAsync(long id, CancellationToken ct);
        Task<bool> UpdateAsync(SystemNotification notification);
        Task<int> MarkAllAsReadAsync(CancellationToken ct);
    }
}
