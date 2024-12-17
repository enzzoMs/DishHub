using System.Text.Json;

namespace DishHub.API.Utils;

public static class JsonDefaults
{
    public static JsonSerializerOptions JsonSerializerDefaults { get; } = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };
}