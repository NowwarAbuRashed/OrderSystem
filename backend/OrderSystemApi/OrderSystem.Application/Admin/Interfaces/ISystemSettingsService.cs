using OrderSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystem.Application.Admin.Interfaces
{
    public interface ISystemSettingsService
    {
        Task<Dictionary<string, string>> GetAllSettingsAsync(CancellationToken ct);
        Task<string?> GetSettingAsync(string key, CancellationToken ct);
        Task SaveSettingsAsync(Dictionary<string, string> settings, CancellationToken ct);
    }
}
