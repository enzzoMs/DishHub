using System.ComponentModel.DataAnnotations;
using DishHub.API.Models;

namespace DishHub.API.Endpoints.Reviews.Requests;

public record UpdateReviewRequest(
    [Required(AllowEmptyStrings = false)]
    [MaxLength(ReviewModel.MaxCommentLength)]
    string Comment,
    [Range(ReviewModel.RatingMinValue, ReviewModel.RatingMaxValue)]
    double Rating
);