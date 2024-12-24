using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using DishHub.API.Data;
using DishHub.API.Endpoints.Menu;
using DishHub.API.Endpoints.Restaurants;
using DishHub.API.Endpoints.Reviews;
using DishHub.API.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.Configure<ApiSettings>(
    builder.Configuration.GetSection(nameof(ApiSettings))
);

const string apiDocUri = "dishhub-api";
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(apiDocUri, new OpenApiInfo
    {
        Version = "v1",
        Title = "Dish Hub API",
        Description = "API for the Dish Hub app.",
        TermsOfService = new Uri("https://opensource.org/licenses/MIT")
    });
    options.SupportNonNullableReferenceTypes();
    
    var xmlFileName = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFileName));
});

builder.Services.AddTransient<RestaurantsService>();
builder.Services.AddTransient<ReviewsService>();
builder.Services.AddTransient<MenuService>();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration["DatabaseSettings:ConnectionString"]);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint($"/swagger/{apiDocUri}/swagger.json", "Dish Hub API");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();