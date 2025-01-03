using System.ComponentModel.DataAnnotations;

namespace DishHub.API.Endpoints.Auth.Requests;

public record LoginRequest(
    [Required(AllowEmptyStrings = false)]
    string Username,
    [Required(AllowEmptyStrings = false)]
    string Password
);