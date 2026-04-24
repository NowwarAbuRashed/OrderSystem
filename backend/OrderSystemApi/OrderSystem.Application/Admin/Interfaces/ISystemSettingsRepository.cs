using OrderSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface ISystemSettingsRepository
    {
        Task<List<SystemSetting>> GetAllAsync(CancellationToken ct);
        Task<SystemSetting?> GetByKeyAsync(string key, CancellationToken ct);
        Task UpsertAsync(string key, string value, string? description, CancellationToken ct);
    }
}
