using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("users");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(u => u.FullName)
                .HasColumnName("full_name")
                .HasColumnType("VARCHAR(150)")
                .IsRequired(); 

            builder.Property(u => u.Email)
                .HasColumnName("email")
                .HasColumnType("VARCHAR(190)")
                .IsRequired();  

            builder.Property(u => u.PasswordHash)
                .HasColumnName("password_hash")
                .HasColumnType("VARCHAR(255)")
                .IsRequired(); 
                                
            builder.Property(u => u.Role)
               .HasColumnName("role")
               .HasConversion<string>()
               .HasMaxLength(20)
               .IsRequired();


            builder.Property(u => u.IsActive)
                .HasColumnName("is_active")
                .HasDefaultValue(true)
                .IsRequired();  

             
            builder.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("SYSUTCDATETIME()")
                .IsRequired();

            builder.Property(u => u.UpdatedAt)
                .HasColumnName("updated_at")
                .IsRequired();  

            builder.HasIndex(u => u.Email)
                .IsUnique();

            builder.HasIndex(u => u.Role);

            // Relationships

            //builder.HasMany(u => u.Orders)
            //    .WithOne(o => o.Customer)
            //    .HasForeignKey(o => o.CustomerId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //builder.HasMany(u => u.Carts)
            //    .WithOne(c => c.Customer)
            //    .HasForeignKey(c => c.CustomerId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //builder.HasMany(u => u.InventoryMovementsPerformed)
            //    .WithOne(im => im.PerformedByUser)
            //    .HasForeignKey(im => im.PerformedBy)
            //    .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
