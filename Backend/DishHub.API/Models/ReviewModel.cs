namespace DishHub.API.Models;

public record ReviewModel(
    string UserName,
    string Comment,
    double Rating,
    DateTime CreationDate
);