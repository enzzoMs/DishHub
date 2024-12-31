using DishHub.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Statistics;

[ApiController]
[Route("statistics")]
public class StatisticsController(AppDbContext appDbContext) : ControllerBase
{
    /// <summary>
    /// Gets the current statistics for the application including the count of
    /// users, restaurants, and reviews.
    /// </summary>
    /// <response code="200">Returns the application statistics.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet]
    public async Task<StatisticsDto> GetAppStatistics()
    {
        var usersCount = await appDbContext.Users.CountAsync();
        var restaurantsCount = await appDbContext.Restaurants.CountAsync();
        var reviewsCount = await appDbContext.Reviews.CountAsync();
        
        return new StatisticsDto(usersCount, restaurantsCount, reviewsCount);
    }
}