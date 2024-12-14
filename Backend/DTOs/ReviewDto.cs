namespace DishHub.API.DTOs;

public record ReviewDto(
    string UserName,
    string Comment,
    double Rating,
    DateTime CreationDate
);