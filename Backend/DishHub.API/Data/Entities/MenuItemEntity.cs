using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DishHub.API.Models;
using Microsoft.AspNetCore.Identity;

namespace DishHub.API.Data.Entities;

[Table("Menus")]
public class MenuItemEntity(string description, MenuCategory category, double price)
{
    public int Id { get; private set; }
    
    [MaxLength(MenuItemModel.MaxDescriptionLength)]
    public string Description { get; set; } = description;

    public MenuCategory Category { get; set; } = category;

    public double Price { get; set; } = price;
    
    public required IdentityUser User { get; set; }

    public required RestaurantEntity Restaurant { get; set; }
}