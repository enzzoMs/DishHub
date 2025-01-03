using System.Security.Claims;
using System.Text.Json;
using DishHub.API.Auth;
using DishHub.API.Data.Extensions;
using DishHub.API.Endpoints.Restaurants.Requests;
using DishHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DishHub.API.Endpoints.Restaurants;

[ApiController]
[Route("/restaurants")]
public class RestaurantsController(
    RestaurantsService restaurantsService, 
    UserManager<IdentityUser> userManager,
    IAuthorizationService authorizationService,
    IOptions<ApiSettings> apiSettings) : ControllerBase
{
    private const int DefaultPageSize = 10;
    
    /// <summary>
    /// Gets a list of all restaurants or a paginated list of restaurants.
    /// </summary>
    /// <response code="200">
    /// Returns all restaurants or paginated list of restaurants.<br/><br/>
    /// If a negative page number is provided, the API will default to page number 1.<br/><br/>
    /// In case of paginated response, it also sets a custom `X-Pagination`
    /// header with metadata information about the pagination.
    /// </response>
    /// <response code="400">If the request parameters are invalid.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpGet(Name = "GetAllRestaurants")]
    public async Task<ActionResult<List<RestaurantModel>>> GetAllRestaurants(
        [FromQuery] RestaurantsFilters filters,
        [FromQuery] int? page, 
        [FromQuery] int pageSize = DefaultPageSize)
    {
        if (page == null)
        {
            var allRestaurants = await restaurantsService.GetAllRestaurants();
            return Ok(allRestaurants);
        }
        
        var paginatedRestaurants = await restaurantsService.GetPaginatedRestaurants(
            page.Value, pageSize, filters
        );
        
        var paginationMetadata = await restaurantsService.GetPaginatedRestaurantsMetadata(
            page.Value, pageSize, filters, Url.Link("GetAllRestaurants", new {})!
        );

        Response.Headers[apiSettings.Value.PaginationHeaderField] = JsonSerializer.Serialize(
            paginationMetadata, JsonDefaults.JsonSerializerDefaults
        );

        return Ok(paginatedRestaurants);
    }

    /// <summary>
    /// Gets a specific restaurant by ID.
    /// </summary>
    /// <response code="200">Returns the requested restaurant.</response>
    /// <response code="400">If the restaurant's ID is invalid.</response>
    /// <response code="404">If the restaurant is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id}")]
    public async Task<ActionResult<RestaurantModel>> GetRestaurantById(
        int id, [FromQuery] bool includeReviews = false, [FromQuery] bool includeMenu = false)
    {
        var restaurantEntity = await restaurantsService.GetRestaurantById(id, includeReviews, includeMenu);
        return restaurantEntity == null ? NotFound() : Ok(restaurantEntity.ToModel());
    }
    
    /// <summary>
    /// Creates a restaurants for the current authenticated user.
    /// </summary>
    /// <response code="200">Returns the created restaurant.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<RestaurantModel>> CreateRestaurant(
        [FromBody] CreateRestaurantRequest creationRequest)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var identityUser = await userManager.FindByIdAsync(userId);
        
        var restaurant = await restaurantsService.CreateRestaurant(identityUser!, creationRequest);
        
        return Ok(restaurant);
    }
    
    /// <summary>
    /// Updates the specified restaurant.
    /// </summary>
    /// <response code="200">Returns the updated restaurant.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    /// <response code="403">If the restaurant was not created by the current authenticated user.</response>
    /// <response code="404">If the restaurant is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<RestaurantModel>> UpdateRestaurant(
        int id, [FromBody] UpdateRestaurantRequest updateRequest)
    {
        var restaurantEntity = await restaurantsService.GetRestaurantById(id);

        if (restaurantEntity == null)
        {
            return NotFound();
        }
        
        var authorizationResult = await authorizationService.AuthorizeAsync(
            User, restaurantEntity, AuthorizationExtensions.RestaurantPolicyName
        );

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }
        
        var updatedRestaurant = await restaurantsService.UpdateRestaurant(id, updateRequest);
        
        return Ok(updatedRestaurant!);
    }
    
    /// <summary>
    /// Deletes the specified restaurant.
    /// </summary>
    /// <response code="204">The restaurant was deleted successfully.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    /// <response code="403">If the restaurant was not created by the current authenticated user.</response>
    /// <response code="404">If the restaurant is not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRestaurant(int id)
    {
        var restaurantEntity = await restaurantsService.GetRestaurantById(id);

        if (restaurantEntity == null)
        {
            return NotFound();
        }
        
        var authorizationResult = await authorizationService.AuthorizeAsync(
            User, restaurantEntity, AuthorizationExtensions.RestaurantPolicyName
        );

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }
        
        await restaurantsService.DeleteRestaurant(id);
        
        return NoContent();
    }
}