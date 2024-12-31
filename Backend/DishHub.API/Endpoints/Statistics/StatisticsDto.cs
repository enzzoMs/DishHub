namespace DishHub.API.Endpoints.Statistics;

public record StatisticsDto(
    int UsersCount,
    int RestaurantsCount,
    int ReviewsCount
);