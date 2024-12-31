using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DishHub.API.Data.Entities;

[Table("Menus")]
public class MenuItemEntity(string description)
{
    public int Id { get; private set; }
    
    [MaxLength(300)]
    public string Description { get; set; } = description;

    public MenuCategory Category { get; set; }
    
    public double Price { get; set; }

    public required RestaurantEntity Restaurant { get; set; }
}

public enum MenuCategory
{
    Appetizers,
    MainCourse,
    Pasta,
    Beverages,
    Desserts
}