using OrderSystem.Application.Auth.DTOs.Requests;
using OrderSystem.Application.Auth.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Auth.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
        Task<LoginResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
        Task<ProfileResponse> GetProfileAsync(long userId, CancellationToken cancellationToken);
        Task<ProfileResponse> UpdateProfileAsync(long userId, UpdateProfileRequest request, CancellationToken cancellationToken);
        Task ChangePasswordAsync(long userId, ChangePasswordRequest request, CancellationToken cancellationToken);
    }
}
