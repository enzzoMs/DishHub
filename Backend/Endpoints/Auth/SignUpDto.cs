using System.ComponentModel.DataAnnotations;

namespace DishHub.API.Endpoints.Auth;

public record SignUpDto(
    [Required(AllowEmptyStrings = false, ErrorMessage = "User name cannot be empty.")]
    [MaxLength(256, ErrorMessage = "Field must be less than 256 characters long")]
    string UserName,
    
    [Length(6, 256, ErrorMessage = "Password must be 6 to 256 characters long")] 
    string Password
);