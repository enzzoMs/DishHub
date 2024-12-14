namespace DishHub.API.Endpoints.Reviews;

public record ReviewDto(
    string UserName,
    string Comment,
    double Rating,
    DateTime CreationDate
);