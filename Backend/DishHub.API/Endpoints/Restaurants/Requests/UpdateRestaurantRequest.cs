using System.ComponentModel.DataAnnotations;
using DishHub.API.Models;

namespace DishHub.API.Endpoints.Restaurants.Requests;

public record UpdateRestaurantRequest(
    [Required(AllowEmptyStrings = false)]
    [MaxLength(RestaurantModel.MaxFieldLength)]
    string Name,
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(RestaurantModel.MaxDescriptionLength)]
    string Description,
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(RestaurantModel.MaxFieldLength)]
    string Location
);