using DishHub.API.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<RestaurantEntity> Restaurants { get; private set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MenuItemEntity>()
            .Property(menu => menu.Category)
            .HasConversion<string>();
    }
}