using System.Threading;
using System.Threading.Tasks;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface IAdminNotificationDispatcher
    {
        Task BroadcastNotificationAsync(SystemNotification notification, CancellationToken ct = default);
    }
}
