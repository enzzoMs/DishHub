namespace DishHub.API.Models;

public record UserModel(string UserName)
{
    public const int MaxNameLength = 256;
    
    public const int MaxPasswordLength = 256;
    public const int MinPasswordLength = 6;

    public const string AllowedUserNamePattern = "^[a-zA-Z0-9 ]+$";
    public const string AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
};