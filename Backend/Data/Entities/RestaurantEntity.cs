using System.ComponentModel.DataAnnotations;

namespace DishHub.API.Data.Entities;

public class RestaurantEntity(string name, string description, string location, double score)
{
    public int Id { get; set; }
    
    [MaxLength(80)]
    public string Name { get; set; } = name;

    [MaxLength(300)]
    public string Description { get; set; } = description;

    [MaxLength(80)]
    public string Location { get; set; } = location;

    public double Score { get; set; } = score;
}