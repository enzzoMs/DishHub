namespace DishHub.API.Models;

public record StatisticsModel(
    int UsersCount,
    int RestaurantsCount,
    int ReviewsCount
);