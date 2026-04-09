using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Auth.Interfaces;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using OrderSystem.Infrastructure.Data;

namespace OrderSystem.Api.Seed
{
    public static class DevelopmentUserSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

            if (await context.Users.AnyAsync())
                return;

            var now = DateTime.UtcNow;

            var users = new List<User>
            {
                new User
                {
                    FullName = "System Admin",
                    Email = "admin@local.com",
                    PasswordHash = passwordHasher.Hash("Admin123!"),
                    Role = UserRole.ADMIN,
                    IsActive = true,
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new User
                {
                    FullName = "Store Manager",
                    Email = "manager@local.com",
                    PasswordHash = passwordHasher.Hash("Manager123!"),
                    Role = UserRole.MANAGER,
                    IsActive = true,
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new User
                {
                    FullName = "Test Customer",
                    Email = "customer@local.com",
                    PasswordHash = passwordHasher.Hash("Customer123!"),
                    Role = UserRole.CUSTOMER,
                    IsActive = true,
                    CreatedAt = now,
                    UpdatedAt = now
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
    }
}