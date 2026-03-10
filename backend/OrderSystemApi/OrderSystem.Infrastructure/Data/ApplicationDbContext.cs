using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {


        override protected void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
           
        }
    }
}
