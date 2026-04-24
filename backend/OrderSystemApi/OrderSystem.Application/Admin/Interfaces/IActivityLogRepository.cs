using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface IActivityLogRepository
    {
        Task AddAsync(SystemActivityLog log, CancellationToken cancellationToken = default);
        Task<IEnumerable<SystemActivityLog>> GetRecentLogsAsync(int count, string? entityType = null, long? userId = null, CancellationToken cancellationToken = default);
        Task<SystemActivityLog?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    }
}
