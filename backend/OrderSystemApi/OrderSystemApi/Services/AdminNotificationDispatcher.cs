using Microsoft.AspNetCore.SignalR;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystemApi.Hubs;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystemApi.Services
{
    public class AdminNotificationDispatcher : IAdminNotificationDispatcher
    {
        private readonly IHubContext<AdminHub> _hubContext;

        public AdminNotificationDispatcher(IHubContext<AdminHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task BroadcastNotificationAsync(SystemNotification notification, CancellationToken ct = default)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification, ct);
        }
    }
}
