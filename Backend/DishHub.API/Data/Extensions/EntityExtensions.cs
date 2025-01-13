using DishHub.API.Data.Entities;
using DishHub.API.Models;

namespace DishHub.API.Data.Extensions;

public static class EntityExtensions
{
    public static RestaurantModel ToModel(this RestaurantEntity restaurantEntity) => new(
        Id: restaurantEntity.Id,
        Name: restaurantEntity.Name,
        Description: restaurantEntity.Description,
        Location: restaurantEntity.Location,
        Score: restaurantEntity.Score,
        Reviews: restaurantEntity.Reviews.Select(review => review.ToModel()),
        Menu: restaurantEntity.Menu.Select(menuItem => menuItem.ToModel())
    );
    
    public static ReviewModel ToModel(this ReviewEntity reviewEntity) => new(
        Id: reviewEntity.Id,
        UserName: reviewEntity.User.UserName!,
        Comment: reviewEntity.Comment,
        Rating: reviewEntity.Rating,
        CreationDate: reviewEntity.CreationDate,
        RestaurantId: reviewEntity.Restaurant.Id,
        RestaurantName: reviewEntity.Restaurant.Name
    );
    
    public static MenuItemModel ToModel(this MenuItemEntity menuItemEntity) => new(
        Id: menuItemEntity.Id,
        Name: menuItemEntity.Name,
        Description: menuItemEntity.Description,
        Price: menuItemEntity.Price
    );
}