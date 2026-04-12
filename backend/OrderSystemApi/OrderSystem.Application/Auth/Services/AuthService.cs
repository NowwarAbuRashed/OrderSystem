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

        public async Task<LoginResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.FullName))
                throw new Exception("Email, Password, and Full Name are required");

            var email = request.Email.Trim().ToLowerInvariant();

            // Check if email already exists
            var existingUser = await _userRepository.GetByEmailAsync(email, cancellationToken);
            if (existingUser != null)
                throw new Exception("An account with this email already exists");

            // Hash the password
            var passwordHash = _passwordHasher.Hash(request.Password);

            // Create new user explicitly restricted to Customer role
            var newUser = new OrderSystem.Domain.Entities.User
            {
                FullName = request.FullName.Trim(),
                Email = email,
                PasswordHash = passwordHash,
                Role = OrderSystem.Domain.Enums.UserRole.CUSTOMER,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(newUser, cancellationToken);

            // Auto-login after successful registration
            var expiresAtUtc = _jwtTokenGenerator.GetExpiryUtc();
            var token = _jwtTokenGenerator.GenerateToken(newUser, expiresAtUtc);

            return new LoginResponse
            {
                UserId = newUser.Id,
                FullName = newUser.FullName,
                Email = newUser.Email,
                Role = newUser.Role.ToString(),
                Token = token,
                ExpiresAtUtc = expiresAtUtc
            };
        }

        public async Task<DTOs.Responses.ProfileResponse> GetProfileAsync(long userId, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new Exception("User not found");

            return new DTOs.Responses.ProfileResponse
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task<DTOs.Responses.ProfileResponse> UpdateProfileAsync(long userId, UpdateProfileRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.FullName))
                throw new Exception("Full Name is required");

            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new Exception("User not found");

            user.FullName = request.FullName.Trim();
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user, cancellationToken);

            return new DTOs.Responses.ProfileResponse
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task ChangePasswordAsync(long userId, ChangePasswordRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
                throw new Exception("Current password and new password are required");

            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null)
                throw new Exception("User not found");

            var isCurrentValid = _passwordHasher.Verify(request.CurrentPassword, user.PasswordHash);
            if (!isCurrentValid)
                throw new Exception("Current password is incorrect");

            user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user, cancellationToken);
        }
    }
}