using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Repositories
{
    public class SystemNotificationRepository : ISystemNotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public SystemNotificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<long> AddAsync(SystemNotification notification, CancellationToken ct)
        {
            _context.SystemNotifications.Add(notification);
            await _context.SaveChangesAsync(ct);
            return notification.Id;
        }

        public async Task<List<SystemNotification>> GetUnreadAsync(int limit, CancellationToken ct)
        {
            return await _context.SystemNotifications
                .Where(n => !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .Take(limit)
                .ToListAsync(ct);
        }

        public async Task<List<SystemNotification>> GetRecentAsync(int limit, CancellationToken ct)
        {
            return await _context.SystemNotifications
                .OrderByDescending(n => n.CreatedAt)
                .Take(limit)
                .ToListAsync(ct);
        }

        public async Task<SystemNotification?> GetByIdAsync(long id, CancellationToken ct)
        {
            return await _context.SystemNotifications.FindAsync(new object[] { id }, ct);
        }

        public async Task<bool> UpdateAsync(SystemNotification notification)
        {
            _context.SystemNotifications.Update(notification);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<int> MarkAllAsReadAsync(CancellationToken ct)
        {
            var unread = await _context.SystemNotifications.Where(n => !n.IsRead).ToListAsync(ct);
            if (!unread.Any()) return 0;
            
            foreach (var item in unread)
            {
                item.IsRead = true;
            }
            
            _context.SystemNotifications.UpdateRange(unread);
            return await _context.SaveChangesAsync(ct);
        }
    }
}
