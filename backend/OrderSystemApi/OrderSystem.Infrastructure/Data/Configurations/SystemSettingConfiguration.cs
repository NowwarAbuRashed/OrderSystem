using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Infrastructure.Data.Configurations
{
    public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
    {
        public void Configure(EntityTypeBuilder<SystemSetting> builder)
        {
            builder.ToTable("system_settings");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Key).IsRequired().HasMaxLength(255);
            builder.Property(x => x.Value).IsRequired().HasColumnType("nvarchar(max)");
            builder.Property(x => x.Description).HasMaxLength(500);
            builder.HasIndex(x => x.Key).IsUnique();
        }
    }
}
