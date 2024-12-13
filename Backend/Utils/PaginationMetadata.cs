namespace DishHub.API.Utils;

public record PaginationMetadata(
  int PageIndex,
  int PageSize,
  int TotalPages,
  string? PreviousPageUrl,
  string? NextPageUrl
);