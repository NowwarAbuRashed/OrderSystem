using AutoMapper;
using OrderSystem.Application.Inventory.DTOs.Responses;
using OrderSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OrderSystem.Application.Common.Mappings
{
    public class InventoryProfile:Profile
    {
        public InventoryProfile()
        {
            CreateMap<InventoryMovement, InventoryMovementResponse>()
                          .ForMember(dest => dest.ProductName,
                              opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty))
                          .ForMember(dest => dest.Reason,
                              opt => opt.MapFrom(src => src.Reason.ToString()));
        }

    }
}
