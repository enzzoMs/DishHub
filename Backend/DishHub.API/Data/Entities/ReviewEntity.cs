using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DishHub.API.Models;
using Microsoft.AspNetCore.Identity;

namespace DishHub.API.Data.Entities;

[Table("Reviews")]
public class ReviewEntity(string comment, int rating, DateTime creationDate)
{
    public int Id { get; private set; }

    [MaxLength(ReviewModel.MaxCommentLength)] 
    public string Comment { get; set; } = comment;

    public int Rating { get; set; } = rating;

    public DateTime CreationDate { get; set; } = creationDate;
    
    public required IdentityUser User { get; set; }

    public required RestaurantEntity Restaurant { get; set; }
}