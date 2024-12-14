using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DishHub.API.Data.Entities;

[Table("Reviews")]
public class ReviewEntity(string comment)
{
    public int Id { get; private set; }

    [MaxLength(300)] 
    public string Comment { get; set; } = comment;
    
    public double Rating { get; set; }

    public DateTime CreationDate { get; set; }

    public required RestaurantEntity Restaurant { get; set; }
}