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
    public class SystemNotificationConfiguration : IEntityTypeConfiguration<SystemNotification>
    {
        public void Configure(EntityTypeBuilder<SystemNotification> builder)
        {
            builder.ToTable("system_notifications");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(x => x.Message)
                .IsRequired()
                .HasColumnType("text");

            builder.Property(x => x.NotificationType)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.RelatedEntityType)
                .HasMaxLength(100);

            builder.Property(x => x.RelatedEntityId)
                .HasMaxLength(100);
        }
    }
}
