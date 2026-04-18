using OrderSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface ISystemNotificationService
    {
        Task<long> SendNotificationAsync(string type, string title, string message, string? entityType = null, string? entityId = null, CancellationToken ct = default);
        Task<List<SystemNotification>> GetUnreadNotificationsAsync(int limit, CancellationToken ct = default);
        Task<List<SystemNotification>> GetRecentNotificationsAsync(int limit, CancellationToken ct = default);
        Task<bool> MarkAsReadAsync(long notificationId, CancellationToken ct = default);
        Task<int> MarkAllAsReadAsync(CancellationToken ct = default);
    }
}
