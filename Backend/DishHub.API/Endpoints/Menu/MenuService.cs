using DishHub.API.Data;
using DishHub.API.Data.Extensions;
using DishHub.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Menu;

public class MenuService(AppDbContext appDbContext)
{
    public async Task<List<MenuItemModel>?> GetRestaurantMenu(int restaurantId)
    {
        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Menu)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

        return restaurantEntity?.Menu.Select(menuItem => menuItem.ToModel()).ToList();
    }

    public async Task<MenuItemModel?> GetRestaurantMenuItem(int restaurantId, int menuItemId)
    {
        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Menu)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

        var menuItemEntity = restaurantEntity?.Menu.FirstOrDefault(item => item.Id == menuItemId);
        
        return menuItemEntity?.ToModel();
    }
    
    public async Task<List<MenuItemModel>?> GetPaginatedRestaurantsMenu(
        int restaurantId, int page, int pageSize)
    {
        page = page < 1 ? 1 : page;

        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Menu)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
        
        return restaurantEntity?.Menu
            .OrderBy(review => review.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(menuItem => menuItem.ToModel())
            .ToList();
    }

    public async Task<PaginationMetadata?> GetPaginatedMenuMetadata(
        int restaurantId, int page, int pageSize, string restaurantMenuUrl)
    {
        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Menu)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

        if (restaurantEntity == null)
        {
            return null;
        }
        
        var menuCount = restaurantEntity.Menu.Count;
        var totalPages = menuCount == 0 ? 
            1 : (int) Math.Ceiling((double) menuCount / pageSize);

        var previousPageLink = page == 1 ? 
            null : $"{restaurantMenuUrl}?page={page - 1}&pageSize={pageSize}";
        
        var nextPageLink = page == totalPages ?
            null : $"{restaurantMenuUrl}?page={page + 1}&pageSize={pageSize}";
        
        return new PaginationMetadata(
            page, pageSize, menuCount, previousPageLink, nextPageLink
        );
    }
}