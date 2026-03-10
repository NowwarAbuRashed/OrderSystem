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
    public class CartConfiguration : IEntityTypeConfiguration<Cart>
    {
        public void Configure(EntityTypeBuilder<Cart> builder)
        {
            builder.ToTable("carts");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(c => c.CustomerId)
                .HasColumnName("customer_id")
                .IsRequired();

            builder.Property(c => c.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired()
                .HasDefaultValue(CartStatus.ACTIVE);

            builder.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("SYSUTCDATETIME()")
                .IsRequired();

            builder.Property(c => c.UpdatedAt)
                .HasColumnName("updated_at")
                .IsRequired();
        
            builder.HasIndex(c => c.CustomerId)
                .IsUnique()
                .HasFilter("[status]='ACTIVE'"); 
            // Relationships

            //builder.HasOne(c => c.Customer)
            //    .WithMany(u => u.Carts)
            //    .HasForeignKey(c => c.CustomerId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //builder.HasMany(c => c.CartItems)
            //    .WithOne(ci => ci.Cart)
            //    .HasForeignKey(ci => ci.CartId)
            //    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
