using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystemApi.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/notifications")]
    [Authorize(Roles = "ADMIN,MANAGER")]
    public class AdminNotificationsController : ControllerBase
    {
        private readonly ISystemNotificationService _notificationService;

        public AdminNotificationsController(ISystemNotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("unread")]
        public async Task<ActionResult<List<SystemNotification>>> GetUnread([FromQuery] int limit = 50, CancellationToken ct = default)
        {
            var notifications = await _notificationService.GetUnreadNotificationsAsync(limit, ct);
            return Ok(notifications);
        }

        [HttpGet("recent")]
        public async Task<ActionResult<List<SystemNotification>>> GetRecent([FromQuery] int limit = 50, CancellationToken ct = default)
        {
            var notifications = await _notificationService.GetRecentNotificationsAsync(limit, ct);
            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(long id, CancellationToken ct)
        {
            var success = await _notificationService.MarkAsReadAsync(id, ct);
            if (!success) return NotFound();
            return Ok(new { Message = "Notification marked as read." });
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead(CancellationToken ct)
        {
            var count = await _notificationService.MarkAllAsReadAsync(ct);
            return Ok(new { Message = $"Marked {count} notifications as read." });
        }
    }
}
