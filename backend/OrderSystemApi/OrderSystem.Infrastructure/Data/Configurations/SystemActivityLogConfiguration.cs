using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderSystem.Domain.Entities;

namespace OrderSystem.Infrastructure.Data.Configurations
{
    public class SystemActivityLogConfiguration : IEntityTypeConfiguration<SystemActivityLog>
    {
        public void Configure(EntityTypeBuilder<SystemActivityLog> builder)
        {
            builder.ToTable("system_activity_logs");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.ActionType)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("action_type");

            builder.Property(a => a.EntityType)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("entity_type");

            builder.Property(a => a.EntityId)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnName("entity_id");

            builder.Property(a => a.PerformedByUserId)
                .HasColumnName("user_id");

            builder.Property(a => a.Timestamp)
                .IsRequired()
                .HasColumnName("timestamp");

            builder.Property(a => a.Details)
                .IsRequired()
                .HasColumnType("nvarchar(max)")
                .HasColumnName("details");

            builder.HasOne(a => a.PerformedByUser)
                .WithMany()
                .HasForeignKey(a => a.PerformedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
