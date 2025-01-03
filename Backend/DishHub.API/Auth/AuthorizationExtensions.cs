using DishHub.API.Auth.Requirements;
using Microsoft.AspNetCore.Authorization;

namespace DishHub.API.Auth;

public static class AuthorizationExtensions
{
    public const string RestaurantPolicyName = "RestaurantPolicy";
    public const string ReviewPolicyName = "ReviewPolicy";
    public const string MenuItemPolicyName = "MenuItemPolicy";

    public static void AddRestaurantPolicy(this AuthorizationOptions options)
    {
        options.AddPolicy(RestaurantPolicyName, policyBuilder =>
        {
            policyBuilder.Requirements.Add(new SameAuthorRequirement());
        });
    }
    
    public static void AddReviewPolicy(this AuthorizationOptions options)
    {
        options.AddPolicy(ReviewPolicyName, policyBuilder =>
        {
            policyBuilder.Requirements.Add(new SameAuthorRequirement());
        });
    }
    
    public static void AddMenuItemPolicy(this AuthorizationOptions options)
    {
        options.AddPolicy(MenuItemPolicyName, policyBuilder =>
        {
            policyBuilder.Requirements.Add(new SameAuthorRequirement());
        });
    }
}