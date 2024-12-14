using System.Text.Json;
using DishHub.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Controllers;

[ApiController]
[Route("/restaurants/{restaurantId}/reviews")]
public class ReviewsController(ReviewsService reviewsService) : ControllerBase
{
    private const int DefaultPageSize = 10;

    [HttpGet(Name = "GetAllRestaurantReviews")]
    public async Task<IActionResult> GetAllRestaurantReviews(
        int restaurantId, [FromQuery] int? page, [FromQuery] int pageSize = DefaultPageSize)
    {
        if (page == null)
        {
            var allReviews = await reviewsService.GetAllRestaurantReviews(restaurantId);
            return allReviews == null ? NotFound() : Ok(allReviews);
        }
        
        var paginatedReviews = await reviewsService.GetPaginatedRestaurantsReviews(
            restaurantId, page.Value, pageSize
        );

        if (paginatedReviews == null)
        {
            return NotFound();
        }
        
        var paginationMetadata = await reviewsService.GetPaginatedReviewsMetadata(
            restaurantId, page.Value, pageSize, Url.Link("GetAllRestaurantReviews", new{})!
        );
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(paginationMetadata);

        return Ok(paginatedReviews);
    }

    [HttpGet("{reviewId}")]
    public async Task<IActionResult> GetRestaurantReviewById(int restaurantId, int reviewId)
    {
        var review = await reviewsService.GetRestaurantReview(restaurantId, reviewId);
        return review == null ? NotFound() : Ok(review);
    }
}