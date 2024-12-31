using DishHub.API.Data;
using DishHub.API.Data.Entities;
using DishHub.API.Data.Extensions;
using DishHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Restaurants;

public class RestaurantsService(AppDbContext appDbContext)
{
    public Task<List<RestaurantModel>> GetAllRestaurants() => appDbContext.Restaurants
        .AsNoTracking()
        .Select(restaurant => restaurant.ToModel())
        .ToListAsync();

    public async Task<RestaurantModel?> GetRestaurantById(int id, bool includeReviews, bool includeMenu)
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

        var restaurantEntity = await restaurantsQuery.FirstOrDefaultAsync(restaurant => restaurant.Id == id);

        return restaurantEntity?.ToModel();
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