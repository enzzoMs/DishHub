namespace DishHub.API.Models;

public record ReviewModel(
    int Id,
    string UserName,
    string Comment,
    double Rating,
    DateTime CreationDate,
    int RestaurantId,
    string RestaurantName
)
{
    public const int RatingMinValue = 1;
    public const int RatingMaxValue = 5;
    
    public const int MaxCommentLength = 256;
}