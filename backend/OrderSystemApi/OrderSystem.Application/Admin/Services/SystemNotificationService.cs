using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystem.Application.Admin.Services
{
    public class SystemNotificationService : ISystemNotificationService
    {
        private readonly ISystemNotificationRepository _repository;
        private readonly IAdminNotificationDispatcher _dispatcher;

        public SystemNotificationService(ISystemNotificationRepository repository, IAdminNotificationDispatcher dispatcher)
        {
            _repository = repository;
            _dispatcher = dispatcher;
        }

        public async Task<long> SendNotificationAsync(string type, string title, string message, string? entityType = null, string? entityId = null, CancellationToken ct = default)
        {
            var notification = new SystemNotification
            {
                NotificationType = type,
                Title = title,
                Message = message,
                RelatedEntityType = entityType,
                RelatedEntityId = entityId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _repository.AddAsync(notification, ct);
            
            // Broadcast to connected admins
            await _dispatcher.BroadcastNotificationAsync(notification, ct);

            return notification.Id;
        }

        public async Task<List<SystemNotification>> GetUnreadNotificationsAsync(int limit, CancellationToken ct = default)
        {
            return await _repository.GetUnreadAsync(limit, ct);
        }

        public async Task<List<SystemNotification>> GetRecentNotificationsAsync(int limit, CancellationToken ct = default)
        {
            return await _repository.GetRecentAsync(limit, ct);
        }

        public async Task<bool> MarkAsReadAsync(long notificationId, CancellationToken ct = default)
        {
            var notification = await _repository.GetByIdAsync(notificationId, ct);
            if (notification == null) return false;

            notification.IsRead = true;
            return await _repository.UpdateAsync(notification);
        }

        public async Task<int> MarkAllAsReadAsync(CancellationToken ct = default)
        {
            return await _repository.MarkAllAsReadAsync(ct);
        }
    }
}
