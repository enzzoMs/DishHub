using DishHub.API.Data;
using DishHub.API.Utils;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Restaurants;

public class RestaurantsService(AppDbContext appDbContext)
{
    public Task<List<RestaurantDto>> GetAllRestaurants() => appDbContext.Restaurants
        .AsNoTracking()
        .Select(restaurant => DtoMapper.MapRestaurant(restaurant))
        .ToListAsync();

    public async Task<RestaurantDto?> GetRestaurantById(int id, bool includeReviews, bool includeMenu)
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
        
        return restaurantEntity == null ? null : DtoMapper.MapRestaurant(restaurantEntity);
    }

    public Task<List<RestaurantDto>> GetPaginatedRestaurants(int page, int pageSize)
    {
        page = page < 1 ? 1 : page;

        return appDbContext.Restaurants
            .AsNoTracking()
            .OrderBy(restaurant => restaurant.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(restaurant => DtoMapper.MapRestaurant(restaurant))
            .ToListAsync(); 
    }

    public async Task<PaginationMetadata> GetPaginatedRestaurantsMetadata(
        int page, int pageSize, string restaurantsUrl)
    {
        var restaurantsCount = await appDbContext.Restaurants.CountAsync();
        var totalPages = restaurantsCount == 0 ? 
            1 : (int) Math.Ceiling((double) restaurantsCount / pageSize);

        var previousPageLink = page == 0 ? 
            null : $"{restaurantsUrl}?page={page - 1}&pageSize={pageSize}";
        
        var nextPageLink = page == totalPages ?
            null : $"{restaurantsUrl}?page={page + 1}&pageSize={pageSize}";
        
        return new PaginationMetadata(
            page, pageSize, totalPages, previousPageLink, nextPageLink
        );
    }
}