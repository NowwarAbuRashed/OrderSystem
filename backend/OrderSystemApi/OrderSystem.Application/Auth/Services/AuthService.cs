using OrderSystem.Application.Auth.DTOs.Requests;
using OrderSystem.Application.Auth.DTOs.Responses;
using OrderSystem.Application.Auth.Interfaces;

namespace OrderSystem.Application.Auth.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IJwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                throw new Exception("Email and password are required");

            var email = request.Email.Trim().ToLowerInvariant();

            var user = await _userRepository.GetByEmailAsync(email, cancellationToken);

            if (user == null)
                throw new Exception("Invalid email or password");

            if (!user.IsActive)
                throw new Exception("This account is inactive");

            var isPasswordValid = _passwordHasher.Verify(request.Password, user.PasswordHash);

            if (!isPasswordValid)
                throw new Exception("Invalid email or password");

            var expiresAtUtc = _jwtTokenGenerator.GetExpiryUtc();
            var token = _jwtTokenGenerator.GenerateToken(user, expiresAtUtc);

            return new LoginResponse
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                Token = token,
                ExpiresAtUtc = expiresAtUtc
            };
        }
    }
}