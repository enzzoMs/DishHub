using System.Text.Json;

namespace DishHub.API.Endpoints;

public static class JsonDefaults
{
    public static JsonSerializerOptions JsonSerializerDefaults { get; } = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };
}