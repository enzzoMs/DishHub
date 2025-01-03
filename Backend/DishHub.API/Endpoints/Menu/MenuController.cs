using System.Security.Claims;
using System.Text.Json;
using DishHub.API.Auth;
using DishHub.API.Data.Extensions;
using DishHub.API.Endpoints.Menu.Requests;
using DishHub.API.Endpoints.Restaurants;
using DishHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DishHub.API.Endpoints.Menu;

[ApiController]
[Route("restaurants/{restaurantId}/menu")]
public class MenuController(
    MenuService menuService,
    RestaurantsService restaurantsService,
    UserManager<IdentityUser> userManager,
    IAuthorizationService authorizationService,
    IOptions<ApiSettings> apiSettings) : ControllerBase
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
    public async Task<ActionResult<List<MenuItemModel>?>> GetRestaurantMenu(
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
            restaurantId, page.Value, pageSize, Url.Link("GetRestaurantMenu", new {})!
        );
        Response.Headers[apiSettings.Value.PaginationHeaderField] = JsonSerializer.Serialize(
            paginationMetadata, JsonDefaults.JsonSerializerDefaults
        );

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
    public async Task<ActionResult<MenuItemModel?>> GetRestaurantMenuItemById(int menuItemId)
    {
        var menuItemEntity = await menuService.GetRestaurantMenuItem(menuItemId);
        return menuItemEntity == null ? NotFound() : Ok(menuItemEntity.ToModel());
    }
    
    /// <summary>
    /// Creates a menu item for the associated restaurant.
    /// </summary>
    /// <response code="200">Returns the created item</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    /// <response code="403">
    /// If the associated restaurant was not created by the current authenticated user.
    /// </response>
    /// <response code="404">If the associated restaurant does not exist.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<MenuItemModel?>> CreateMenuItem(
        int restaurantId, [FromBody] CreateMenuItemRequest creationRequest)
    {
        var restaurantEntity = await restaurantsService.GetRestaurantById(restaurantId);

        if (restaurantEntity == null)
        {
            return NotFound();
        }
        
        var restaurantAuthResult = await authorizationService.AuthorizeAsync(
            User, restaurantEntity, AuthorizationExtensions.RestaurantPolicyName
        );

        if (!restaurantAuthResult.Succeeded)
        {
            return Forbid();
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var identityUser = await userManager.FindByIdAsync(userId);
        
        var item = await menuService.CreateMenuItem(
            restaurantId, identityUser!, creationRequest
        );
        
        return item == null ? NotFound() : Ok(item);
    }
    
    /// <summary>
    /// Updates the specified menu item.
    /// </summary>
    /// <response code="200">Returns the updated item.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    /// <response code="403">If the menu item was not created by the current authenticated user.</response>
    /// <response code="404">If the menu item does not exist.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<RestaurantModel>> UpdateMenuItem(
        int id, [FromBody] UpdateMenuItemRequest updateRequest)
    {
        var menuItemEntity = await menuService.GetRestaurantMenuItem(id);

        if (menuItemEntity == null)
        {
            return NotFound();
        }
        
        var authorizationResult = await authorizationService.AuthorizeAsync(
            User, menuItemEntity, AuthorizationExtensions.MenuItemPolicyName
        );

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }
        
        var updateItem = await menuService.UpdateMenuItem(id, updateRequest);
        
        return Ok(updateItem!);
    }
    
    /// <summary>
    /// Deletes the specified menu item.
    /// </summary>
    /// <response code="204">The item was deleted successfully.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    /// <response code="403">If the item was not created by the current authenticated user.</response>
    /// <response code="404">If the item is not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenuItem(int id)
    {
        var menuItemEntity = await menuService.GetRestaurantMenuItem(id);

        if (menuItemEntity == null)
        {
            return NotFound();
        }
        
        var authorizationResult = await authorizationService.AuthorizeAsync(
            User, menuItemEntity, AuthorizationExtensions.MenuItemPolicyName
        );

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }
        
        await menuService.DeleteMenuItem(id);
        
        return NoContent();
    }
}