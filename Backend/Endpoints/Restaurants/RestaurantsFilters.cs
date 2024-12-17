using System.ComponentModel.DataAnnotations;

namespace DishHub.API.Endpoints.Restaurants;

public record RestaurantsFilters(
    string? Name,
    string? Location,
    [Range(RestaurantDto.ScoreMinValue, RestaurantDto.ScoreMaxValue)]
    int? Score
);