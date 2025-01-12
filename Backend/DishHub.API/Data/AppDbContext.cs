using DishHub.API.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<RestaurantEntity> Restaurants { get; private set; }
    
    public DbSet<ReviewEntity> Reviews { get; private set; }
    
    public DbSet<MenuItemEntity> MenuItems { get; private set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RestaurantEntity>()
            .Navigation(restaurant => restaurant.User)
            .AutoInclude();
            
        modelBuilder.Entity<RestaurantEntity>()
            .HasOne(restaurant => restaurant.User)
            .WithMany();

        modelBuilder.Entity<ReviewEntity>()
            .Navigation(review => review.User)
            .AutoInclude();
        
        modelBuilder.Entity<ReviewEntity>()
            .HasOne(review => review.User)
            .WithMany();
        
        modelBuilder.Entity<MenuItemEntity>()
            .HasOne(item => item.User)
            .WithMany();
        
        modelBuilder.Entity<MenuItemEntity>()
            .Navigation(item => item.User)
            .AutoInclude();
        
        base.OnModelCreating(modelBuilder);
    }
}