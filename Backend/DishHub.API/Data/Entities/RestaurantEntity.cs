using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DishHub.API.Models;
using Microsoft.AspNetCore.Identity;

namespace DishHub.API.Data.Entities;

[Table("Restaurants")]
public class RestaurantEntity(string name, string description, string location, double score)
{
    public int Id { get; private set; }
    
    [MaxLength(RestaurantModel.MaxFieldLength)]
    public string Name { get; set; } = name;

    [MaxLength(RestaurantModel.MaxDescriptionLength)]
    public string Description { get; set; } = description;

    [MaxLength(RestaurantModel.MaxFieldLength)]
    public string Location { get; set; } = location;
    
    public double Score { get; set; } = score;
    
    public required IdentityUser User { get; set; }

    public ICollection<ReviewEntity> Reviews { get; } = [];
    
    public ICollection<MenuItemEntity> Menu { get; } = [];
}