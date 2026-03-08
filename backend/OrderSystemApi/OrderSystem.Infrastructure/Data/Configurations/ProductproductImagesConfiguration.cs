using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderSystem.Domain.Entities;
namespace OrderSystem.Infrastructure.Data.Configurations
{
    public class ProductproductImagesConfiguration : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> builder)
        {
            builder.ToTable("product_images");


            builder.HasKey(p => p.Id);
            builder.Property(x => x.Id)
             .HasColumnName("id")
             .ValueGeneratedOnAdd()
            .IsRequired();

            builder.Property(x => x.ProductId)
             .HasColumnName("product_id")
            .IsRequired();
            builder.HasIndex(x => x.ProductId);

            builder.Property(p => p.ImageUrl)
                .HasColumnName("image_url")
                .HasColumnType("varchar(500)")
                .IsRequired();

            builder.Property(p => p.AltText)
                .HasColumnName("alt_text")
                .HasColumnType("varchar(200)")
                .IsRequired(false);


            builder.Property(p => p.SortOrder)
                .HasColumnName("sort_order")
                .HasDefaultValue(1)
                .IsRequired();

            builder.Property(p => p.IsPrimary)
                .HasColumnName("is_primary")
                .HasDefaultValue(false)
                .IsRequired();

            builder.Property(p => p.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();


        }
    }
}
