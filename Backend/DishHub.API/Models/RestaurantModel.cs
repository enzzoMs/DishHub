namespace DishHub.API.Models;

public record RestaurantModel(
    int Id,
    string Name,
    string Description,
    string Location,
    double Score,
    IEnumerable<ReviewModel> Reviews,
    IEnumerable<MenuItemModel> Menu
)
{
    public const int ScoreMinValue = 1;
    public const int ScoreMaxValue = 5;
}