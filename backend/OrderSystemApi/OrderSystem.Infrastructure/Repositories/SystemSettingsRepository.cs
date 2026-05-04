using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Admin.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Repositories
{
    public class SystemSettingsRepository : ISystemSettingsRepository
    {
        private readonly ApplicationDbContext _context;

        public SystemSettingsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SystemSetting>> GetAllAsync(CancellationToken ct)
        {
            return await _context.SystemSettings.AsNoTracking().OrderBy(s => s.Key).ToListAsync(ct);
        }

        public async Task<SystemSetting?> GetByKeyAsync(string key, CancellationToken ct)
        {
            return await _context.SystemSettings.AsNoTracking().FirstOrDefaultAsync(s => s.Key == key, ct);
        }

        public async Task UpsertAsync(string key, string value, string? description, CancellationToken ct)
        {
            var existing = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key, ct);
            if (existing != null)
            {
                existing.Value = value;
                if (description != null) existing.Description = description;
                existing.UpdatedAt = DateTime.UtcNow;
                _context.SystemSettings.Update(existing);
            }
            else
            {
                _context.SystemSettings.Add(new SystemSetting
                {
                    Key = key,
                    Value = value,
                    Description = description,
                    UpdatedAt = DateTime.UtcNow
                });
            }
            await _context.SaveChangesAsync(ct);
        }
    }
}
