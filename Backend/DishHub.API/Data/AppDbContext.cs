using DishHub.API.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<RestaurantEntity> Restaurants { get; private set; }
    
    public DbSet<ReviewEntity> Reviews { get; private set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MenuItemEntity>()
            .Property(menu => menu.Category)
            .HasConversion<string>();
        
        base.OnModelCreating(modelBuilder);
    }
}