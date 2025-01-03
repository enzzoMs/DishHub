﻿using System.ComponentModel.DataAnnotations;

namespace DishHub.API.Models;

public record MenuItemModel(
    int Id,
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(MenuItemModel.MaxDescriptionLength)]
    string Description,
    
    MenuCategory Category,
    
    [Range(0, double.MaxValue)]
    double Price
)
{
    public const int MaxDescriptionLength = 256;
}

public enum MenuCategory
{
    Appetizers,
    MainCourse,
    Pasta,
    Beverages,
    Desserts
}
