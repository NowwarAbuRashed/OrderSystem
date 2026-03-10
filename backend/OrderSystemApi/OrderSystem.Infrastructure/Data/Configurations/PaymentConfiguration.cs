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
    internal class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("payments", table =>
            {
                table.HasCheckConstraint("CK_Payment_Amount", "amount >= 0");
            });

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(x => x.OrderId)
           .HasColumnName("order_id")
           .IsRequired();

            builder.Property(x => x.PaymentMethod)
                .HasColumnName("payment_method")
                .HasConversion<string>()
                .IsRequired();

            builder.Property(x => x.Amount)
                .HasColumnName("amount")
                .HasPrecision(12, 2)
                .IsRequired();

            builder.Property(x => x.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .HasDefaultValue(PaymentStatus.PENDING)
                .IsRequired();

            builder.Property(x => x.TransactionRef)
           .HasColumnName("transaction_ref")
           .HasMaxLength(150);

            builder.Property(x => x.PaidAt)
                .HasColumnName("paid_at");

            builder.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                 .HasDefaultValueSql("SYSUTCDATETIME()")
                .IsRequired();

           
        }
    }
}
