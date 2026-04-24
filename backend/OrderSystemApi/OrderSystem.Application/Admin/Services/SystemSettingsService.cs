using OrderSystem.Application.Admin.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystem.Application.Admin.Services
{
    public class SystemSettingsService : ISystemSettingsService
    {
        private readonly ISystemSettingsRepository _repository;

        public SystemSettingsService(ISystemSettingsRepository repository)
        {
            _repository = repository;
        }

        public async Task<Dictionary<string, string>> GetAllSettingsAsync(CancellationToken ct)
        {
            var settings = await _repository.GetAllAsync(ct);
            return settings.ToDictionary(s => s.Key, s => s.Value);
        }

        public async Task<string?> GetSettingAsync(string key, CancellationToken ct)
        {
            var setting = await _repository.GetByKeyAsync(key, ct);
            return setting?.Value;
        }

        public async Task SaveSettingsAsync(Dictionary<string, string> settings, CancellationToken ct)
        {
            foreach (var kvp in settings)
            {
                await _repository.UpsertAsync(kvp.Key, kvp.Value, null, ct);
            }
        }
    }
}
