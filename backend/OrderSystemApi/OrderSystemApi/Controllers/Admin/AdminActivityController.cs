using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OrderSystemApi.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/activity")]
    [Authorize(Roles = "ADMIN")]
    public class AdminActivityController : ControllerBase
    {
        private readonly IActivityLogService _activityLogService;

        public AdminActivityController(IActivityLogService activityLogService)
        {
            _activityLogService = activityLogService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SystemActivityLog>>> GetRecentLogs(
            [FromQuery] int count = 50,
            [FromQuery] string? entityType = null,
            [FromQuery] long? userId = null)
        {
            var logs = await _activityLogService.GetRecentLogsAsync(count, entityType, userId);
            
            // Note: In real app, we map to DTOs. Returning Entity directly for brevity in this internal admin api.
            // We strip password_hash if User is included.
            foreach (var log in logs)
            {
                if (log.PerformedByUser != null)
                {
                    log.PerformedByUser.PasswordHash = string.Empty;
                }
            }
            
            return Ok(logs);
        }
    }
}
