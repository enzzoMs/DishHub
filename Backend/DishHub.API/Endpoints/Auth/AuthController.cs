using DishHub.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Endpoints.Auth;

[ApiController]
[Route("auth")]
public class AuthController(
    UserManager<IdentityUser> userManager,
    SignInManager<IdentityUser> signInManager) : ControllerBase
{
    /// <summary>
    /// Allows a user to login in by providing a username and password. 
    /// </summary>
    /// <response code="200">The login was successful, and user details are returned.</response>
    /// <response code="401">The login failed due to an invalid username or password.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        var user = await userManager.FindByNameAsync(loginRequest.Username);

        if (user == null)
        {
            return Unauthorized("User does not exist.");
        }
        
        var loginResult = await signInManager.PasswordSignInAsync(
            loginRequest.Username, loginRequest.Password, false, false
        );

        if (loginResult.Succeeded)
        {
            return Ok(new UserModel(loginRequest.Username));
        }

        return Unauthorized("Wrong password.");
    }
    
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
    public async Task<IActionResult> SignUp([FromBody] SignUpRequest signUpRequest)
    {
        var user = new IdentityUser { UserName = signUpRequest.UserName };
        
        var existingUser = await userManager.FindByNameAsync(signUpRequest.UserName);

        if (existingUser != null)
        {
            return Conflict("Account already exists");
        }

        var creationResult = await userManager.CreateAsync(user, signUpRequest.Password);

        if (creationResult.Succeeded)
        {
            return Created(
                Url.Link("GetUserInformation", new {}), 
                new UserModel(signUpRequest.UserName)
            );
        }

        foreach (var error in creationResult.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }
        
        return BadRequest(ModelState);
    }

    /// <summary>
    /// Logs out the currently authenticated user. 
    /// </summary>
    /// <response code="200">The user has been successfully logged out.</response>
    /// <response code="401">If the request is made by an unauthenticated user.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }
}