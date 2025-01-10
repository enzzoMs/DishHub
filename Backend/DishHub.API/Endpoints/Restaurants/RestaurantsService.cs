using DishHub.API.Data;
using DishHub.API.Data.Entities;
using DishHub.API.Data.Extensions;
using DishHub.API.Endpoints.Restaurants.Requests;
using DishHub.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Restaurants;

public class RestaurantsService(AppDbContext appDbContext)
{
    public Task<List<RestaurantModel>> GetAllRestaurants() => appDbContext.Restaurants
        .AsNoTracking()
        .Select(restaurant => restaurant.ToModel())
        .ToListAsync();

    public async Task<RestaurantEntity?> GetRestaurantById(
        int id, bool includeReviews = false, bool includeMenu = false)
    {
        var restaurantsQuery = appDbContext.Restaurants.AsNoTracking();
        
        if (includeReviews)
        {
            restaurantsQuery = restaurantsQuery.Include(restaurant => restaurant.Reviews);
        }
        
        if (includeMenu)
        {
            restaurantsQuery = restaurantsQuery.Include(restaurant => restaurant.Menu);
        }
        
        return await restaurantsQuery.FirstOrDefaultAsync(restaurant => restaurant.Id == id);
    }

    public Task<List<RestaurantModel>> GetPaginatedRestaurants(
        int page, int pageSize, RestaurantsFilters filters)
    {
        page = page < 1 ? 1 : page;
        
        return appDbContext.Restaurants
            .AsNoTracking()
            .OrderBy(restaurant => restaurant.Id)
            .FilterRestaurants(filters)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(restaurant => restaurant.ToModel())
            .ToListAsync(); 
    }

    public async Task<PaginationMetadata> GetPaginatedRestaurantsMetadata(
        int page, int pageSize, RestaurantsFilters filters, string restaurantsUrl)
    {
        var restaurantsCount = await appDbContext.Restaurants
            .FilterRestaurants(filters)
            .CountAsync();
        
        var totalPages = restaurantsCount == 0 ? 
            1 : (int) Math.Ceiling((double) restaurantsCount / pageSize);

        var previousPageLink = page == 1 ? 
            null : $"{restaurantsUrl}?page={page - 1}&pageSize={pageSize}";
        
        var nextPageLink = page == totalPages ?
            null : $"{restaurantsUrl}?page={page + 1}&pageSize={pageSize}";
        
        return new PaginationMetadata(
            page, pageSize, restaurantsCount, previousPageLink, nextPageLink
        );
    }
    
    /// <returns>The created restaurant.</returns>
    public async Task<RestaurantModel> CreateRestaurant(
        IdentityUser user, CreateRestaurantRequest creationRequest)
    {
        var restaurantEntity = new RestaurantEntity(
            creationRequest.Name,
            creationRequest.Description,
            creationRequest.Location,
            score: 0
        ) { User = user };
        
        await appDbContext.Restaurants.AddAsync(restaurantEntity);
        await appDbContext.SaveChangesAsync();
        
        return restaurantEntity.ToModel();
    }
    
    /// <returns>The updated restaurant or null if the restaurant does not exist.</returns>
    public async Task<RestaurantModel?> UpdateRestaurant(
        int id, UpdateRestaurantRequest updateRequest)
    {
        var restaurantEntity = await appDbContext.Restaurants.FindAsync(id);

        if (restaurantEntity == null)
        {
            return null;
        }

        restaurantEntity.Name = updateRequest.Name;
        restaurantEntity.Description = updateRequest.Description;
        restaurantEntity.Location = updateRequest.Location;
        
        await appDbContext.SaveChangesAsync();
        
        return restaurantEntity.ToModel();
    }
    
    public async Task DeleteRestaurant(int id)
    {
        var restaurantEntity = await appDbContext.Restaurants.FindAsync(id);

        if (restaurantEntity == null)
        {
            return;
        }

        appDbContext.Restaurants.Remove(restaurantEntity);
        await appDbContext.SaveChangesAsync();
    }
}

public static class RestaurantsServiceExtensions
{
    public static IQueryable<RestaurantEntity> FilterRestaurants(
        this IQueryable<RestaurantEntity> query, RestaurantsFilters filters)
    {
        if (filters.Name != null)
        {
            query = query.Where(restaurant => restaurant.Name.ToLower().Contains(filters.Name.ToLower()));
        }
        if (filters.Location != null)
        {
            query = query.Where(restaurant => restaurant.Location.ToLower().Contains(filters.Location.ToLower()));
        }
        if (filters.Score != null)
        {
            query = query.Where(restaurant => (int)Math.Floor(restaurant.Score) == filters.Score);
        }
        return query;
    }
}