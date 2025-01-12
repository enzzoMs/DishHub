using System.ComponentModel.DataAnnotations;

namespace DishHub.API.Models;

public record MenuItemModel(
    int Id,
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(MenuItemModel.MaxNameLength)]
    string Name,
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(MenuItemModel.MaxDescriptionLength)]
    string Description,
    
    [Range(0, double.MaxValue)]
    double Price
)
{
    public const int MaxNameLength = 64;
    public const int MaxDescriptionLength = 256;
}
