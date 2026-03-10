using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderSystem.Domain.Entities;
using OrderSystem.Domain.Enums;

namespace OrderSystem.Infrastructure.Persistence.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            
            builder.ToTable("orders", t =>
            {
                
                t.HasCheckConstraint("CK_Orders_TotalAmount", "total_amount >= 0");
                
            });

            builder.HasKey(o => o.Id);

            builder.Property(o => o.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(o => o.CustomerId)
                .HasColumnName("customer_id")
                .IsRequired();

            builder.Property(o => o.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .HasMaxLength(30)
                .IsRequired();

            builder.Property(o => o.PaymentMethod)
                .HasColumnName("payment_method")
               .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(o => o.TotalAmount)
                .HasColumnName("total_amount")
                .HasColumnType("decimal(12,2)")
                .IsRequired();

            builder.Property(u => u.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("SYSUTCDATETIME()")
                .IsRequired();

            builder.Property(o => o.ReadyAt)
                .HasColumnName("ready_at")
                .IsRequired(false);

            builder.Property(o => o.OutForDeliveryAt)
                .HasColumnName("out_for_delivery_at")
                .IsRequired(false);

            builder.Property(o => o.DeliveredAt)
                .HasColumnName("delivered_at")
                .IsRequired(false);

            

            builder.HasIndex(o => o.CreatedAt);
            builder.HasIndex(o => o.ReadyAt);
            builder.HasIndex(o => o.DeliveredAt);
            builder.HasIndex(o => o.Status);
            builder.HasIndex(o => o.CustomerId);

            // relationships

            //builder.HasOne(o => o.Customer)
            //    .WithMany(u => u.Orders)
            //    .HasForeignKey(o => o.CustomerId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //builder.HasMany(o => o.OrderItems)
            //    .WithOne(oi => oi.Order)
            //    .HasForeignKey(oi => oi.OrderId)
            //    .OnDelete(DeleteBehavior.Cascade);

            //builder.HasMany(o => o.Payments)
            //    .WithOne(p => p.Order)
            //    .HasForeignKey(p => p.OrderId)
            //    .OnDelete(DeleteBehavior.Cascade);

            //builder.HasMany(o => o.InventoryMovements)
            //    .WithOne(im => im.RefOrder)
            //    .HasForeignKey(im => im.RefOrderId)
            //    .OnDelete(DeleteBehavior.SetNull);
        }
    }
}