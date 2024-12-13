using System.Text.Json;
using DishHub.API.Data;
using DishHub.API.DTOs;
using DishHub.API.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Controllers;

[ApiController]
[Route("/restaurants")]
public class RestaurantsController(AppDbContext appDbContext) : ControllerBase
{
    private const int DefaultPageSize = 10;
    
    [HttpGet(Name = "GetAllRestaurants")]
    public async Task<IActionResult> GetAllRestaurants(
        [FromQuery] int? page, [FromQuery] int pageSize = DefaultPageSize)
    {
        if (page == null)
        {
            var allRestaurants = await appDbContext.Restaurants
                .AsNoTracking()
                .Select(restaurant => DtoMapper.MapRestaurant(restaurant))
                .ToListAsync();
        
            return Ok(allRestaurants);
        }
        
        page = page < 1 ? 1 : page;

        var paginatedRestaurants = await appDbContext.Restaurants
            .AsNoTracking()
            .OrderBy(restaurant => restaurant.Id)
            .Skip((page.Value - 1) * pageSize)
            .Take(pageSize)
            .Select(restaurant => DtoMapper.MapRestaurant(restaurant))
            .ToListAsync();
        
        var restaurantsCount = await appDbContext.Restaurants.CountAsync();
        var totalPages = restaurantsCount == 0 ? 
            1 : (int) Math.Ceiling((double) restaurantsCount / pageSize);

        var previousPageLink = page == 1 ? null : Url.Link(
            "GetAllRestaurants", 
            new { page = page - 1, pageSize }
        );
        var nextPageLink = page == totalPages ? null : Url.Link(
            "GetAllRestaurants", 
            new { page = page + 1, pageSize }
        );
        
        var paginationMetadata = new PaginationMetadata(
            page.Value, pageSize, totalPages, previousPageLink, nextPageLink
        );
        
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(paginationMetadata);

        return Ok(paginatedRestaurants);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRestaurantById(int id)
    {
        var restaurant = await appDbContext.Restaurants.FindAsync(id);

        if (restaurant == null)
        {
            return NotFound();
        }
        return Ok(DtoMapper.MapRestaurant(restaurant));
    }
}