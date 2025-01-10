using DishHub.API.Data;
using DishHub.API.Data.Entities;
using DishHub.API.Data.Extensions;
using DishHub.API.Endpoints.Reviews.Requests;
using DishHub.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DishHub.API.Endpoints.Reviews;

public class ReviewsService(AppDbContext appDbContext)
{
    public async Task<List<ReviewModel>?> GetAllRestaurantReviews(int restaurantId)
    {
        var restaurantEntity = await appDbContext.Restaurants
            .Include(restaurant => restaurant.Reviews)
            .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

        return restaurantEntity?.Reviews.Select(review => review.ToModel()).ToList();
    }

    public async Task<ReviewEntity?> GetRestaurantReview(int reviewId)
    {
        var reviewEntity = await appDbContext.Reviews
            .FirstOrDefaultAsync(review => review.Id == reviewId);
        return reviewEntity;
    }
    
    public async Task<List<ReviewModel>?> GetPaginatedRestaurantsReviews(
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
            .Select(review => review.ToModel())
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
    
    /// <returns>The created review or null if the associated restaurant does not exist.</returns>
    public async Task<ReviewModel?> CreateReview(
        int restaurantId, IdentityUser user, CreateReviewRequest creationRequest)
    {
        var restaurantEntity = await appDbContext.Restaurants.FindAsync(restaurantId);

        if (restaurantEntity == null)
        {
            return null;
        }
        
        var reviewEntity = new ReviewEntity(
            creationRequest.Comment,
            creationRequest.Rating,
            DateTime.UtcNow
        )
        {
            User = user, 
            Restaurant = restaurantEntity
        };
        
        await appDbContext.Reviews.AddAsync(reviewEntity);
        await appDbContext.SaveChangesAsync();
        
        return reviewEntity.ToModel();
    }
    
    /// <returns>The updated review or null if the review does not exist.</returns>
    public async Task<ReviewModel?> UpdateReview(int id, UpdateReviewRequest updateRequest)
    {
        var reviewEntity = await appDbContext.Reviews.FindAsync(id);

        if (reviewEntity == null)
        {
            return null;
        }

        reviewEntity.Comment = updateRequest.Comment;
        reviewEntity.Rating = updateRequest.Rating;
        
        await appDbContext.SaveChangesAsync();
        
        return reviewEntity.ToModel();
    }
    
    public async Task DeleteReview(int id)
    {
        var reviewEntity = await appDbContext.Reviews.FindAsync(id);

        if (reviewEntity == null)
        {
            return;
        }

        appDbContext.Reviews.Remove(reviewEntity);
        await appDbContext.SaveChangesAsync();
    }
}