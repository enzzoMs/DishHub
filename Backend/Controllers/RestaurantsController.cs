using Microsoft.AspNetCore.Mvc;

namespace DishHub.API.Controllers;

[ApiController]
[Route("/restaurants")]
public class RestaurantsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAllRestaurants()
    {
        return NotFound();
    }
}