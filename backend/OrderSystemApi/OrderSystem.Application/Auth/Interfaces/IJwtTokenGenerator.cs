using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Auth.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user, DateTime expiresAtUtc);
        DateTime GetExpiryUtc();
    }
}
