using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Auth;

[ApiController]
[Route("auth")]
public class AuthController(UserManager<IdentityUser> userManager) : ControllerBase
{
    /// <summary>
    /// Allows a user to sign up by providing a username and password. 
    /// </summary>
    /// <response code="201">
    /// Returns the created user's username along with a location URI for the new resource.
    /// </response>
    /// <response code="400">
    /// If the request parameters are invalid (e.g. The password is too short).
    /// </response>
    /// <response code="409">
    /// If the username is already taken by another account.
    /// </response>
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [HttpPost("signup")]
    public async Task<IActionResult> SignUpUser([FromBody] SignUpDto signUpDto)
    {
        var user = new IdentityUser { UserName = signUpDto.UserName };
        
        var existingUser = await userManager.FindByNameAsync(signUpDto.UserName);

        if (existingUser != null)
        {
            return Conflict("Account already exists");
        }

        var creationResult = await userManager.CreateAsync(user, signUpDto.Password);

        if (creationResult.Succeeded)
        {
            // TODO: add uri
            return Created("TODO", new UserDto(signUpDto.UserName));
        }

        foreach (var error in creationResult.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }
        
        return BadRequest(ModelState);
    }
}