using System.Security.Claims;
using DishHub.API.Endpoints.User.Requests;
using DishHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Endpoints.User;

[ApiController]
[Authorize]
[Route("user")]
public class UserController(
    UserService userService,
    SignInManager<IdentityUser> signInManager) : ControllerBase
{
    /// <summary>
    /// Retrieves information about the currently authenticated user.
    /// </summary>
    /// <response code="200">Returns the details of the authenticated user.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [HttpGet(Name="GetUserInformation")]
    public ActionResult<UserModel> GetUserInformation()
    {
        return Ok(new UserModel(User.Identity!.Name!));
    }

    /// <summary>
    /// Returns the restaurants associated with the current authenticated user.
    /// </summary>
    /// <response code="200">Returns the associated restaurants.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [HttpGet("restaurants")]
    public async Task<ActionResult<RestaurantModel[]>> GetUserRestaurants(
        [FromQuery] bool includeReviews = false, [FromQuery] bool includeMenu = false)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var restaurants = await userService.GetUserRestaurants(
            userId, includeReviews, includeMenu
        );
        
        return Ok(restaurants);
    }
    
    /// <summary>
    /// Returns the reviews associated with the current authenticated user.
    /// </summary>
    /// <response code="200">Returns the associated reviews.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [HttpGet("reviews")]
    public async Task<ActionResult<ReviewModel[]>> GetUserReviews()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var reviews = await userService.GetUserReviews(userId);
        
        return Ok(reviews);
    }
    
    /// <summary>
    /// Updates the current authenticated user.
    /// </summary>
    /// <response code="200">Returns the updated user.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [HttpPatch]
    public async Task<ActionResult<UserModel>> UpdateUser(
        [FromBody] UpdateUserRequest updateRequest)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        
        var updatedUser = await userService.UpdateUser(userId, updateRequest);
        
        return Ok(updatedUser!);
    }
    
    /// <summary>
    /// Deletes the current authenticated user.
    /// </summary>
    /// <response code="204">The user was deleted successfully.</response>
    /// <response code="400">If the request format is invalid.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> DeleteUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        await signInManager.SignOutAsync();
        
        await userService.DeleteUser(userId);
        
        return NoContent();
    }
}