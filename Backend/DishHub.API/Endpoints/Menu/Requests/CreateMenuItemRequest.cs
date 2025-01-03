using System.ComponentModel.DataAnnotations;
using DishHub.API.Models;

namespace DishHub.API.Endpoints.Menu.Requests;

public record CreateMenuItemRequest(
    [Required(AllowEmptyStrings = false)]
    [MaxLength(MenuItemModel.MaxDescriptionLength)]
    string Description,
    
    MenuCategory Category,
    
    [Range(0, double.MaxValue)]
    double Price
);