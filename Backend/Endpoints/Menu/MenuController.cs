using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Endpoints.Menu;

[ApiController]
[Route("restaurants/{restaurantId}/menu")]
public class MenuController(MenuService menuService) : ControllerBase
{
    private const int DefaultPageSize = 10;

    [HttpGet("GetRestaurantMenu")]    
    public async Task<IActionResult> GetRestaurantMenu(
        int restaurantId, [FromQuery] int? page, [FromQuery] int pageSize = DefaultPageSize)
    {
        if (page == null)
        {
            var restaurantMenu = await menuService.GetRestaurantMenu(restaurantId);
            return restaurantMenu == null ? NotFound() : Ok(restaurantMenu);
        }
        
        var paginatedMenu = await menuService.GetPaginatedRestaurantsMenu(
            restaurantId, page.Value, pageSize
        );

        if (paginatedMenu == null)
        {
            return NotFound();
        }
        
        var paginationMetadata = await menuService.GetPaginatedMenuMetadata(
            restaurantId, page.Value, pageSize, Url.Link("GetRestaurantMenu", new{})!
        );
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(paginationMetadata);

        return Ok(paginatedMenu);
    }

    [HttpGet("{menuItemId}")]
    public async Task<IActionResult> GetRestaurantMenuItemById(int restaurantId, int menuItemId)
    {
        var restaurantMenuItem = await menuService.GetRestaurantMenuItem(restaurantId, menuItemId);
        return restaurantMenuItem == null ? NotFound() : Ok(restaurantMenuItem);
    }
}