using DishHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Endpoints.User;

[ApiController]
[Authorize]
[Route("user")]
public class UserController : ControllerBase
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
}