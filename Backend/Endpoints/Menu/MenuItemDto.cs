using DishHub.API.Data.Entities;

namespace DishHub.API.Endpoints.Menu;

public record MenuItemDto(
    int Id,
    string Description,
    MenuCategory Category,
    double Price
);