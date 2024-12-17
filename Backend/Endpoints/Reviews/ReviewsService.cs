using DishHub.API.Data;
using DishHub.API.Utils;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Reviews;

public class ReviewsService(AppDbContext appDbContext)
{
    public async Task<List<ReviewDto>?> GetAllRestaurantReviews(int restaurantId)
    {
        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Reviews)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

        return restaurantEntity?.Reviews.Select(DtoMapper.MapReview).ToList();
    }

    public async Task<ReviewDto?> GetRestaurantReview(int restaurantId, int reviewId)
    {
        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Reviews)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

        var reviewEntity = restaurantEntity?.Reviews.FirstOrDefault(review => review.Id == reviewId);
        
        return reviewEntity == null ? null : DtoMapper.MapReview(reviewEntity);
    }
    
    public async Task<List<ReviewDto>?> GetPaginatedRestaurantsReviews(
        int restaurantId, int page, int pageSize)
    {
        page = page < 1 ? 1 : page;

        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Reviews)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
        
        return restaurantEntity?.Reviews
            .OrderBy(review => review.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(DtoMapper.MapReview)
            .ToList();
    }

    public async Task<PaginationMetadata?> GetPaginatedReviewsMetadata(
        int restaurantId, int page, int pageSize, string restaurantReviewsUrl)
    {
        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Reviews)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

        if (restaurantEntity == null)
        {
            return null;
        }
        
        var reviewsCount = restaurantEntity.Reviews.Count;
        var totalPages = reviewsCount == 0 ? 
            1 : (int) Math.Ceiling((double) reviewsCount / pageSize);

        var previousPageLink = page == 1 ? 
            null : $"{restaurantReviewsUrl}?page={page - 1}&pageSize={pageSize}";
        
        var nextPageLink = page == totalPages ?
            null : $"{restaurantReviewsUrl}?page={page + 1}&pageSize={pageSize}";
        
        return new PaginationMetadata(
            page, pageSize, reviewsCount, previousPageLink, nextPageLink
        );
    }
}