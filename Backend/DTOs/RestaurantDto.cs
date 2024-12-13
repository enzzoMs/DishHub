namespace DishHub.API.DTOs;

public record RestaurantDto(
    int Id, 
    string Name, 
    string Description, 
    string Location,
    double Score
);