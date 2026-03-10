using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Infrastructure.Data.Configurations
{
    public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> builder)
        {
            builder.ToTable("cart_items", t =>
            {
                t.HasCheckConstraint("CK_CartItems_Quantity", "quantity > 0");
            });

            builder.HasKey(ci => ci.Id);

            builder.Property(ci => ci.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(ci => ci.CartId)
                .HasColumnName("cart_id")
                .IsRequired();

            builder.Property(ci => ci.ProductId)
                .HasColumnName("product_id")
                .IsRequired();

            builder.Property(ci => ci.Quantity)
                .HasColumnName("quantity")
                .IsRequired();

            builder.Property(ci => ci.UnitPriceSnapshot)
                .HasColumnName("unit_price_snapshot")
                .HasColumnType("decimal(10,2)")
                .IsRequired(false);

            builder.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("SYSUTCDATETIME()")
                .IsRequired();

            // not duplicate product in the same cart as two records
            builder.HasIndex(ci => new { ci.CartId, ci.ProductId })
                .IsUnique();

            // Relationships

            //builder.HasOne(ci => ci.Cart)
            //    .WithMany(c => c.CartItems)
            //    .HasForeignKey(ci => ci.CartId)
            //    .OnDelete(DeleteBehavior.Cascade);

            // 
            //builder.HasOne(ci => ci.Product)
            //    .WithMany(p => p.CartItems)
            //    .HasForeignKey(ci => ci.ProductId)
            //    .OnDelete(DeleteBehavior.Restrict); // لأنو لو المنتج مستخدم بال cartItem  ف ما ينحذف المنتج
        }
    }
}
