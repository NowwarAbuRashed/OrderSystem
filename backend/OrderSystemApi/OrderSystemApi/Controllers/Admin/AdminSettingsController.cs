using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderSystem.Application.Admin.Interfaces;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderSystemApi.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/system-settings")]
    [Authorize(Roles = "ADMIN")]
    public class AdminSettingsController : ControllerBase
    {
        private readonly ISystemSettingsService _settingsService;

        public AdminSettingsController(ISystemSettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var settings = await _settingsService.GetAllSettingsAsync(ct);
            return Ok(settings);
        }

        [HttpPut]
        public async Task<IActionResult> SaveAll([FromBody] Dictionary<string, string> settings, CancellationToken ct)
        {
            await _settingsService.SaveSettingsAsync(settings, ct);
            return Ok(new { message = "Settings saved successfully" });
        }
    }
}
