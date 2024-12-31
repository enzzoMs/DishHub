using System.ComponentModel.DataAnnotations;
using DishHub.API.Data.Entities;

namespace DishHub.API.Models;

public record MenuItemModel(
    int Id,
    [MaxLength(300, ErrorMessage = "{0} length cannot exceed {1} characters.")]
    string Description,
    MenuCategory Category,
    double Price
);
