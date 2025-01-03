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
    
    public const int MaxFieldLength = 64;
    public const int MaxDescriptionLength = 256;
}