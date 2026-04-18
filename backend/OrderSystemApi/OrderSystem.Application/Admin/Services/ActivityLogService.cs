using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Application.Admin.Services
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IActivityLogRepository _repository;

        public ActivityLogService(IActivityLogRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SystemActivityLog>> GetRecentLogsAsync(int count = 50, string? entityType = null, long? userId = null, CancellationToken cancellationToken = default)
        {
            return await _repository.GetRecentLogsAsync(count, entityType, userId, cancellationToken);
        }

        public async Task LogActionAsync(string actionType, string entityType, string entityId, long? userId, object? details = null, CancellationToken cancellationToken = default)
        {
            var log = new SystemActivityLog
            {
                ActionType = actionType,
                EntityType = entityType,
                EntityId = entityId,
                PerformedByUserId = userId,
                Details = details != null ? JsonSerializer.Serialize(details) : "{}"
            };

            await _repository.AddAsync(log, cancellationToken);
        }
    }
}
