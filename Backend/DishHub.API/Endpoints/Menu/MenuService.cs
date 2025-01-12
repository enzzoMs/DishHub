using DishHub.API.Data;
using DishHub.API.Data.Entities;
using DishHub.API.Data.Extensions;
using DishHub.API.Endpoints.Menu.Requests;
using DishHub.API.Models;
using Microsoft.AspNetCore.Identity;
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

    public async Task<MenuItemEntity?> GetRestaurantMenuItem(int menuItemId)
    {
        var menuItemEntity = await appDbContext.MenuItems
            .Include(item => item.User)
            .FirstOrDefaultAsync(item => item.Id == menuItemId);
        return menuItemEntity;
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
    
    /// <returns>The created menu item or null if the associated restaurant does not exist.</returns>
    public async Task<MenuItemModel?> CreateMenuItem(
        int restaurantId, IdentityUser user, CreateMenuItemRequest creationRequest)
    {
        var restaurantEntity = await appDbContext.Restaurants.FindAsync(restaurantId);

        if (restaurantEntity == null)
        {
            return null;
        }
        
        var menuItemEntity = new MenuItemEntity(
            creationRequest.Name,
            creationRequest.Description,
            creationRequest.Price
        )
        {
            User = user, 
            Restaurant = restaurantEntity
        };
        
        await appDbContext.MenuItems.AddAsync(menuItemEntity);
        await appDbContext.SaveChangesAsync();
        
        return menuItemEntity.ToModel();
    }
    
    /// <returns>The updated menu item or null if the item does not exist.</returns>
    public async Task<MenuItemModel?> UpdateMenuItem(int id, UpdateMenuItemRequest updateRequest)
    {
        var menuItemEntity = await appDbContext.MenuItems.FindAsync(id);

        if (menuItemEntity == null)
        {
            return null;
        }

        menuItemEntity.Name = updateRequest.Name;
        menuItemEntity.Description = updateRequest.Description;
        menuItemEntity.Price = updateRequest.Price;
        
        await appDbContext.SaveChangesAsync();
        
        return menuItemEntity.ToModel();
    }

    public async Task DeleteMenuItem(int id)
    {
        var menuItemEntity = await appDbContext.MenuItems.FindAsync(id);

        if (menuItemEntity == null)
        {
            return;
        }

        appDbContext.MenuItems.Remove(menuItemEntity);
        await appDbContext.SaveChangesAsync();
    }
}