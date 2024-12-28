using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Auth;

[ApiController]
[Route("auth")]
public class AuthController(UserManager<IdentityUser> userManager) : ControllerBase
{
    // Bad Request
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