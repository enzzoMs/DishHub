using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Endpoints.Reviews;

[ApiController]
[Route("/restaurants/{restaurantId}/reviews")]
public class ReviewsController(ReviewsService reviewsService) : ControllerBase
{
    private const int DefaultPageSize = 10;

    /// <summary>
    /// Gets all reviews for a restaurant or a paginated version of the reviews.
    /// </summary>
    /// <response code="200">
    /// Returns the restaurant's reviews or paginated reviews.<br/><br/>
    /// If a negative page number is provided, the API will default to page number 1.<br/><br/>
    /// In case of paginated response, it also sets a custom `X-Pagination`
    /// header with metadata information about the pagination.
    /// </response>
    /// <response code="400">If the restaurant's ID is invalid.</response>
    /// <response code="404">If the restaurant is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet(Name = "GetAllRestaurantReviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetAllRestaurantReviews(
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

    /// <summary>
    /// Gets a specific restaurant's review by ID.
    /// </summary>
    /// <response code="200">Returns the requested review.</response>
    /// <response code="400">If the restaurant's ID or the review ID is invalid.</response>
    /// <response code="404">If the restaurant's review is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{reviewId}")]
    public async Task<ActionResult<ReviewDto?>> GetRestaurantReviewById(int restaurantId, int reviewId)
    {
        var review = await reviewsService.GetRestaurantReview(restaurantId, reviewId);
        return review == null ? NotFound() : Ok(review);
    }
}