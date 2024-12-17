using DishHub.API.Endpoints.Reviews;

namespace DishHub.API.Endpoints.Restaurants;

public record RestaurantDto(
    int Id,
    string Name,
    string Description,
    string Location,
    double Score,
    IEnumerable<ReviewDto> Reviews
)
{
    public const int ScoreMinValue = 1;
    public const int ScoreMaxValue = 5;
}