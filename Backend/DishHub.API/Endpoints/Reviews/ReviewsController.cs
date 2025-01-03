using System.Security.Claims;
using System.Text.Json;
using DishHub.API.Auth;
using DishHub.API.Data.Extensions;
using DishHub.API.Endpoints.Reviews.Requests;
using DishHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DishHub.API.Endpoints.Reviews;

[ApiController]
[Route("/restaurants/{restaurantId}/reviews")]
public class ReviewsController(
    ReviewsService reviewsService,
    UserManager<IdentityUser> userManager,
    IAuthorizationService authorizationService,
    IOptions<ApiSettings> apiSettings) : ControllerBase
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
    public async Task<ActionResult<List<ReviewModel>>> GetAllRestaurantReviews(
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
            restaurantId, page.Value, pageSize, Url.Link("GetAllRestaurantReviews", new {})!
        );
        Response.Headers[apiSettings.Value.PaginationHeaderField] = JsonSerializer.Serialize(
            paginationMetadata, JsonDefaults.JsonSerializerDefaults
        );

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
    public async Task<ActionResult<ReviewModel?>> GetRestaurantReviewById(int reviewId)
    {
        var reviewEntity = await reviewsService.GetRestaurantReview(reviewId);
        return reviewEntity == null ? NotFound() : Ok(reviewEntity.ToModel());
    }
    
    /// <summary>
    /// Creates a review for the current authenticated user.
    /// </summary>
    /// <response code="200">Returns the created review.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    /// <response code="404">If the associated review does not exist.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReviewModel?>> CreateReview(
        int restaurantId, [FromBody] CreateReviewRequest creationRequest)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var identityUser = await userManager.FindByIdAsync(userId);
        
        var review = await reviewsService.CreateReview(
            restaurantId, identityUser!, creationRequest
        );
        
        return review == null ? NotFound() : Ok(review);
    }
    
    /// <summary>
    /// Updates the specified review.
    /// </summary>
    /// <response code="200">Returns the updated review.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    /// <response code="403">If the review was not created by the current authenticated user.</response>
    /// <response code="404">If the review does not exist.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<RestaurantModel>> UpdateReview(
        int id, [FromBody] UpdateReviewRequest updateRequest)
    {
        var reviewEntity = await reviewsService.GetRestaurantReview(id);

        if (reviewEntity == null)
        {
            return NotFound();
        }
        
        var authorizationResult = await authorizationService.AuthorizeAsync(
            User, reviewEntity, AuthorizationExtensions.ReviewPolicyName
        );

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }
        
        var updatedReview = await reviewsService.UpdateReview(id, updateRequest);
        
        return Ok(updatedReview!);
    }
    
    /// <summary>
    /// Deletes the specified review.
    /// </summary>
    /// <response code="204">The review was deleted successfully.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    /// <response code="403">If the review was not created by the current authenticated user.</response>
    /// <response code="404">If the review is not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var reviewEntity = await reviewsService.GetRestaurantReview(id);

        if (reviewEntity == null)
        {
            return NotFound();
        }
        
        var authorizationResult = await authorizationService.AuthorizeAsync(
            User, reviewEntity, AuthorizationExtensions.ReviewPolicyName
        );

        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }
        
        await reviewsService.DeleteReview(id);
        
        return NoContent();
    }
}