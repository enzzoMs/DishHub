using System.ComponentModel.DataAnnotations;
using DishHub.API.Models;

namespace DishHub.API.Endpoints.Restaurants;

public record RestaurantsFilters(
    string? Name,
    string? Location,
    [Range(RestaurantModel.ScoreMinValue, RestaurantModel.ScoreMaxValue)]
    int? Score
);