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
    public class UserConfiguration : IEntityTypeConfiguration<Users>
    {
        public void Configure(EntityTypeBuilder<Users> builder)
        {
            builder.ToTable("users");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();// aouto-increment

            builder.Property(u => u.FullName)
                .HasColumnName("full_name").
                HasColumnType("VARCHAR")
                .HasMaxLength(150)
                .IsRequired(); // not null

            builder.Property(u => u.Email)
                .HasColumnName("email").
                HasColumnType("VARCHAR")
                .HasMaxLength(190)
                .IsRequired();  

            builder.Property(u => u.PasswordHash)
                .HasColumnName("password_hash").
                HasColumnType("VARCHAR")
                .HasMaxLength(255)
                .IsRequired(); 
                                
            builder.Property(u => u.Role)
               .HasColumnName("role")
               // هاذا الجزء مسؤول عن التحويل بين : C# Enum <-> Database String
               .HasConversion( // يخزنها بالنص: CUSTOMER / MANAGER / ADMIN
                   v => v.ToString().ToUpper(),
                   //  لما نقرأ من الداتا بيز , يحول مع تجاهل الاحرف الكبيرة والصغيرة
                   v => Enum.Parse<UserRole>(v, true))
               .HasMaxLength(20)
               .IsRequired();


            builder.Property(u => u.IsActive)
                .HasColumnName("is_active")
                .HasDefaultValue(true)
                .IsRequired();  

            builder.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
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
