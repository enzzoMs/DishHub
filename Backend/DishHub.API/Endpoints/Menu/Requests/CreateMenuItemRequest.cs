﻿using System.ComponentModel.DataAnnotations;
using DishHub.API.Models;

namespace DishHub.API.Endpoints.Menu.Requests;

public record CreateMenuItemRequest(
    [Required(AllowEmptyStrings = false)]
    [MaxLength(MenuItemModel.MaxNameLength)]
    string Name,
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(MenuItemModel.MaxDescriptionLength)]
    string Description,
    
    [Range(0, double.MaxValue)]
    double Price
);