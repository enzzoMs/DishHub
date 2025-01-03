using DishHub.API.Data;
using DishHub.API.Data.Extensions;
using DishHub.API.Endpoints.User.Requests;
using DishHub.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.User;

public class UserService(AppDbContext appDbContext, UserManager<IdentityUser> userManager)
{
    public async Task<List<RestaurantModel>> GetUserRestaurants(
        string userId, bool includeReviews, bool includeMenu)
    {
        var restaurantsQuery = appDbContext.Restaurants.Where(
            restaurant => restaurant.User.Id == userId
        );

        if (includeReviews)
        {
            restaurantsQuery = restaurantsQuery.Include(restaurant => restaurant.Reviews);
        }
        
        if (includeMenu)
        {
            restaurantsQuery = restaurantsQuery.Include(restaurant => restaurant.Menu);
        }
        
        return await restaurantsQuery
            .Select(restaurant => restaurant.ToModel())
            .ToListAsync();
    }
    
    public async Task<List<ReviewModel>> GetUserReviews(string userId)
    {
        var reviews = await appDbContext.Reviews
            .Where(review => review.User.Id == userId)
            .Include(review => review.User)
            .ToListAsync();
        
        return reviews
            .Select(review => review.ToModel())
            .ToList();
    }

    /// <returns>The updated user or null if the user does not exist.</returns>
    public async Task<UserModel?> UpdateUser(string userId, UpdateUserRequest updateRequest)
    {
        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return null;
        }
        
        var passwordHash = userManager.PasswordHasher.HashPassword(
            user, updateRequest.Password
        );
        
        user.UserName = updateRequest.UserName;
        user.PasswordHash = passwordHash;
        
        await userManager.UpdateAsync(user);
        
        return new UserModel(user.UserName);
    }

    public async Task DeleteUser(string userId)
    {
        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return;
        }
        
        await userManager.DeleteAsync(user);
    }
}