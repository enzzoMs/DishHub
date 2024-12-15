using System.ComponentModel.DataAnnotations;
using DishHub.API.Data.Entities;

namespace DishHub.API.Endpoints.Menu;

public record MenuItemDto(
    int Id,
    [MaxLength(300, ErrorMessage = "{0} length cannot exceed {1} characters.")]
    string Description,
    MenuCategory Category,
    double Price
);
