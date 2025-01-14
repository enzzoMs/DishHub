using System.ComponentModel.DataAnnotations;
using DishHub.API.Models;

namespace DishHub.API.Endpoints.Reviews.Requests;

public record CreateReviewRequest(
    [Required(AllowEmptyStrings = false)]
    [MaxLength(ReviewModel.MaxCommentLength)]
    string Comment,
    [Range(ReviewModel.RatingMinValue, ReviewModel.RatingMaxValue)]
    int Rating
);