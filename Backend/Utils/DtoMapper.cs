using DishHub.API.Data.Entities;
using DishHub.API.DTOs;

namespace DishHub.API.Utils;

public static class DtoMapper
{
    public static RestaurantDto MapRestaurant(RestaurantEntity restaurantEntity) => new(
        Id: restaurantEntity.Id,
        Name: restaurantEntity.Name,
        Description: restaurantEntity.Description,
        Location: restaurantEntity.Location,
        Score: restaurantEntity.Score
    );
}