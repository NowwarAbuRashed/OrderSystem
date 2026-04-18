using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface IActivityLogService
    {
        Task LogActionAsync(string actionType, string entityType, string entityId, long? userId, object? details = null, CancellationToken cancellationToken = default);
        Task<IEnumerable<SystemActivityLog>> GetRecentLogsAsync(int count = 50, string? entityType = null, long? userId = null, CancellationToken cancellationToken = default);
    }
}
