﻿namespace DishHub.API.Utils;

public record PaginationMetadata(
  int PageNumber,
  int PageSize,
  int TotalItems,
  string? PreviousPageUrl,
  string? NextPageUrl
);