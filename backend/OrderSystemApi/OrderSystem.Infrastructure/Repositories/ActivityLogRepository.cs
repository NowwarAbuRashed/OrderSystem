using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Infrastructure.Data;

namespace OrderSystem.Infrastructure.Repositories
{
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(SystemActivityLog log, CancellationToken cancellationToken = default)
        {
            await _context.SystemActivityLogs.AddAsync(log, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<SystemActivityLog?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await _context.SystemActivityLogs
                .Include(l => l.PerformedByUser)
                .FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
        }

        public async Task<IEnumerable<SystemActivityLog>> GetRecentLogsAsync(int count, string? entityType = null, long? userId = null, CancellationToken cancellationToken = default)
        {
            var query = _context.SystemActivityLogs
                .Include(l => l.PerformedByUser)
                .AsQueryable();

            if (!string.IsNullOrEmpty(entityType))
            {
                query = query.Where(l => l.EntityType == entityType);
            }

            if (userId.HasValue)
            {
                query = query.Where(l => l.PerformedByUserId == userId.Value);
            }

            return await query
                .OrderByDescending(l => l.Timestamp)
                .Take(count)
                .ToListAsync(cancellationToken);
        }
    }
}
