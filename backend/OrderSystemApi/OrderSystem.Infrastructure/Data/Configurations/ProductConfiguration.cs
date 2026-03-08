using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using OrderSystem.Domain.Entities;
using System;
using System;
using System.Collections.Generic;
using System.Collections.Generic;
using System.Linq;
using System.Linq;
using System.Text;
using System.Text;
using System.Threading.Tasks;
using System.Threading.Tasks;
namespace OrderSystem.Infrastructure.Data.Configurations
{
    public class ProductConfiguration: IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products");
            builder.ToTable(nameof(OrderItem), table =>
            {
                table.HasCheckConstraint("CK_Product_Price", "price >= 0");
                table.HasCheckConstraint("CK_Product_Quantity", "quantity >= 0");
                table.HasCheckConstraint("CK_Product_MinQuantity", "min_quantity >= 0");
            });
            
            builder.HasKey(p => p.Id);
            builder.Property(x => x.Id)
             .HasColumnName("id")
             .ValueGeneratedOnAdd()
            .IsRequired();

            builder.Property(p=>p.Name)
                .HasColumnName ("name")
                .HasColumnType("varchar(200)")
                .IsRequired();
            builder.HasIndex(x => x.Name);

            builder.Property(p => p.Description)
                .HasColumnName("description")
                .IsRequired(false);
                 

            builder.Property(p=>p.Price)
                .HasColumnName("price")
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(p=>p.Quantity)
                .HasColumnName("quantity")
                .IsRequired();

            builder.Property(p => p.MinQuantity)
                .HasColumnName("min_quantity")
                .IsRequired();

            builder.Property(p => p.Status)
             .HasColumnName("status")
             .HasDefaultValue("Active")
             .IsRequired();
            builder.HasIndex(x => x.Status);

            builder.Property(p => p.CategoryId)
                .HasColumnName("category_id")
                .IsRequired();
            builder.HasIndex(x => x.CategoryId);

            builder.Property(p => p.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            builder.Property(p => p.UpdatedAt)
                .HasColumnName("updated_at")
                .IsRequired();

            //Configure the relationship with Category
            // builder.HasOne(x => x.Category)
            //.WithMany(c => c.Products)
            //.HasForeignKey(x => x.CategoryId)
            //.OnDelete(DeleteBehavior.SetNull);
        }
    }
}
