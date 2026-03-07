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
    public class CartConfiguration : IEntityTypeConfiguration<Carts>
    {
        public void Configure(EntityTypeBuilder<Carts> builder)
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
                .HasConversion(
                    v => ConvertCartStatusToDb(v),
                    v => ConvertCartStatusFromDb(v))
                .HasMaxLength(20)
                .IsRequired()
                .HasDefaultValue(CartStatus.Active);

            builder.Property(c => c.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(c => c.UpdatedAt)
                .HasColumnName("updated_at")
                .IsRequired();
            // مركب Unique Index , يعني ما بصير يتكرر نفس الزوج بريكورد معين
            // لضمان ان العميل عندو سلة واحدة فقط تكون Active او CheckedOut في نفس الوقت
            // هذا يمنع تعدد CHECKED_OUT أيضًا. !!! 
            builder.HasIndex(c => new { c.CustomerId, c.Status })
                .IsUnique();

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

        private static string ConvertCartStatusToDb(CartStatus status)
        {
            if (status == CartStatus.Active)
                return "ACTIVE";

            if (status == CartStatus.CheckedOut)
                return "CHECKED_OUT";

            throw new InvalidOperationException("Invalid cart status");
        }

        private static CartStatus ConvertCartStatusFromDb(string status)
        {
            if (status == "ACTIVE")
                return CartStatus.Active;

            if (status == "CHECKED_OUT")
                return CartStatus.CheckedOut;

            throw new InvalidOperationException("Invalid cart status value from database");
        }
    }
}
