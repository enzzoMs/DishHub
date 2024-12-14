using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DishHub.API.Data.Entities;

[Table("Restaurants")]
public class RestaurantEntity(string name, string description, string location, double score)
{
    public int Id { get; private set; }
    
    [MaxLength(80)]
    public string Name { get; set; } = name;

    [MaxLength(300)]
    public string Description { get; set; } = description;

    [MaxLength(80)]
    public string Location { get; set; } = location;

    public double Score { get; set; } = score;

    public ICollection<ReviewEntity> Reviews { get; } = [];
    
    public ICollection<MenuItemEntity> Menu { get; } = [];
}