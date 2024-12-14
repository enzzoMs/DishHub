using System.Text.Json;
using DishHub.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Controllers;

[ApiController]
[Route("/restaurants")]
public class RestaurantsController(RestaurantsService restaurantsService) : ControllerBase
{
    private const int DefaultPageSize = 10;
    
    [HttpGet(Name = "GetAllRestaurants")]
    public async Task<IActionResult> GetAllRestaurants(
        [FromQuery] int? page, [FromQuery] int pageSize = DefaultPageSize)
    {
        if (page == null)
        {
            var allRestaurants = await restaurantsService.GetAllRestaurants();
            return Ok(allRestaurants);
        }
        
        var paginatedRestaurants = await restaurantsService.GetPaginatedRestaurants(
            page.Value, pageSize
        );
        
        var paginationMetadata = await restaurantsService.GetPaginatedRestaurantsMetadata(
            page.Value, pageSize, Url.Link("GetAllRestaurants", new{})!
        );
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(paginationMetadata);

        return Ok(paginatedRestaurants);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRestaurantById(
        int id, [FromQuery] bool includeReviews = false)
    {
        var restaurant = await restaurantsService.GetRestaurantById(id, includeReviews);
        return restaurant == null ? NotFound() : Ok(restaurant);
    }
}