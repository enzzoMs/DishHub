using System.Text.Json;
using DishHub.API.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DishHub.API.Endpoints.Restaurants;

[ApiController]
[Route("/restaurants")]
public class RestaurantsController(
    RestaurantsService restaurantsService, 
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
    public async Task<ActionResult<List<RestaurantDto>>> GetAllRestaurants(
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
    public async Task<ActionResult<RestaurantDto>> GetRestaurantById(
        int id, [FromQuery] bool includeReviews = false, [FromQuery] bool includeMenu = false)
    {
        var restaurant = await restaurantsService.GetRestaurantById(id, includeReviews, includeMenu);
        return restaurant == null ? NotFound() : Ok(restaurant);
    }
}