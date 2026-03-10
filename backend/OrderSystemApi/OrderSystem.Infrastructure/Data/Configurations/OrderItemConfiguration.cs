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
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.ToTable(nameof(OrderItem),table =>
            {
                // Check Constraints
                table.HasCheckConstraint("CK_OrderItem_Quantity", "quantity > 0");
                table.HasCheckConstraint("CK_OrderItem_UnitPrice", "unit_price >= 0");
            });

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(x => x.OrderId)
                .HasColumnName("order_id")
                .IsRequired();

            builder.Property(x => x.productId)
                   .HasColumnName("product_id")
                   .IsRequired();

            builder.Property(x => x.Quantity)
           .HasColumnName("quantity")
           .IsRequired();

            builder.Property(x => x.UnitPrice)
            .HasColumnName("unit_price")
            .HasPrecision(10, 2)
            .IsRequired();

            builder.Property(x => x.LineTotal)
            .HasColumnName("line_total")
            .HasPrecision(12, 2)
            .IsRequired();

            // Relationships
            builder.HasOne(x => x.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(x => x.ProductId);



            //// Optional Unique constraint
            builder.HasIndex(x => new { x.OrderId, x.productId})
                .IsUnique();
        }
    }
}
