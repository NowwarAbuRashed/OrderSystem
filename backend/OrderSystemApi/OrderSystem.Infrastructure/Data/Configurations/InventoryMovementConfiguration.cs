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
    public class InventoryMovementConfiguration : IEntityTypeConfiguration<InventoryMovement>
    {
        public void Configure(EntityTypeBuilder<InventoryMovement> builder)
        {
            builder.ToTable("inventory_movements");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(x => x.ChangeQty)
                .IsRequired();

            builder.Property(x => x.Reason)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(x => x.CreatedAt)
                   .HasDefaultValueSql("SYSUTCDATETIME()")
                   .IsRequired();




            builder.HasOne(x => x.PerformedByUser)
              .WithMany(n => n.InventoryMovementsPerformed)
              .HasForeignKey(x => x.PerformedBy)
              .OnDelete(DeleteBehavior.SetNull);


            builder.HasOne(x => x.RefOrder)
                .WithMany(n=>n.InventoryMovements)
                .HasForeignKey(x => x.RefOrderId)
                .OnDelete(DeleteBehavior.SetNull);

          
            builder.HasOne(x => x.Product)
                .WithMany(n => n.InventoryMovements)
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Cascade);





        }
    }
}
