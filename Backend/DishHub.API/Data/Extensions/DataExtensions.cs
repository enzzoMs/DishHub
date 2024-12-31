using DishHub.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Data.Extensions;

public static class DataExtensions
{
    public static IServiceCollection AddDataServices(
        this IServiceCollection services, string connectionString)
    {
        services
            .AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.User.RequireUniqueEmail = false;
                options.User.AllowedUserNameCharacters = UserModel.AllowedUserNameCharacters;
            })
            .AddEntityFrameworkStores<AppDbContext>();
        
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        return services;
    }
}