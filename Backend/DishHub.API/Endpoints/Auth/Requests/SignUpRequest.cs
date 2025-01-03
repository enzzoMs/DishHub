using System.ComponentModel.DataAnnotations;
using DishHub.API.Models;

namespace DishHub.API.Endpoints.Auth.Requests;

public record SignUpRequest(
    [Required(AllowEmptyStrings = false)]
    [MaxLength(UserModel.MaxNameLength)]
    [RegularExpression(UserModel.AllowedUserNamePattern)]
    string UserName,
    
    [Required(AllowEmptyStrings = false)]
    [Length(UserModel.MinPasswordLength, UserModel.MaxPasswordLength)] 
    string Password
);