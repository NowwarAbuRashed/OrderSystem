
using Microsoft.EntityFrameworkCore;
using OrderSystem.Application.Carts.Interfaces;
using OrderSystem.Application.Carts.Services;
using OrderSystem.Application.Common.Mappings;
using OrderSystem.Application.Inventorys.Interfaces;
using OrderSystem.Application.Inventorys.Services;
using OrderSystem.Application.Inventory.Interfaces;
using OrderSystem.Application.Inventory.Services;
using OrderSystem.Application.Orders.Interfaces;
using OrderSystem.Application.Orders.Services;
using OrderSystem.Application.Payments.Interfaces;
using OrderSystem.Application.Payments.Services;
using OrderSystem.Application.Products.Interfaces;
using OrderSystem.Application.Products.Services;
using OrderSystem.Infrastructure.Data;
using OrderSystem.Infrastructure.Repositories;

namespace OrderSystemApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            
            // Add services to the container.

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


            builder.Services.AddAutoMapper(cfg => { }, typeof(InventoryProfile));

            builder.Services.AddScoped<IInventoryMovementRepository, InventoryMovementRepository>();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<IProductService, ProductService>();

            builder.Services.AddScoped<IInventoryService, InventoryService>();

        
            builder.Services.AddScoped<ICartRepository, CartRepository>();
            builder.Services.AddScoped<ICartItemRepository, CartItemRepository>();
            builder.Services.AddScoped<ICartService, CartService>();

          
          

            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IOrderItemRepository, OrderItemRepository>();
            builder.Services.AddScoped<IOrderService, OrderService>();

            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();

        }
    }
}
