using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Endpoints.Menu;

[ApiController]
[Route("restaurants/{restaurantId}/menu")]
public class MenuController(MenuService menuService) : ControllerBase
{
    private const int DefaultPageSize = 10;
    
    /// <summary>
    /// Gets the full menu for a restaurant or a paginated version of the menu.
    /// </summary>
    /// <response code="200">
    /// Returns the restaurant's menu or paginated menu.<br/><br/>
    /// If a negative page number is provided, the API will default to page number 1.<br/><br/>
    /// In case of paginated response, it also sets a custom `X-Pagination`
    /// header with metadata information about the pagination.
    /// </response>
    /// <response code="400">If the restaurant's ID is invalid.</response>
    /// <response code="404">If the restaurant is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet(Name = "GetRestaurantMenu")]    
    public async Task<ActionResult<List<MenuItemDto>?>> GetRestaurantMenu(
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

    /// <summary>
    /// Gets a specific restaurant's menu item by ID.
    /// </summary>
    /// <response code="200">Returns the requested menu item.</response>
    /// <response code="400">If the restaurant's ID or the menu item's ID is invalid.</response>
    /// <response code="404">If the restaurant's menu item is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{menuItemId}")]
    public async Task<ActionResult<MenuItemDto?>> GetRestaurantMenuItemById(int restaurantId, int menuItemId)
    {
        var restaurantMenuItem = await menuService.GetRestaurantMenuItem(restaurantId, menuItemId);
        return restaurantMenuItem == null ? NotFound() : Ok(restaurantMenuItem);
    }
}