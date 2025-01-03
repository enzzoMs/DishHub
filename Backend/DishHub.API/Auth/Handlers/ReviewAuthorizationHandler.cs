using System.Security.Claims;
using DishHub.API.Auth.Requirements;
using DishHub.API.Data.Entities;
using Microsoft.AspNetCore.Authorization;

namespace DishHub.API.Auth.Handlers;

public class ReviewAuthorizationHandler 
    : AuthorizationHandler<SameAuthorRequirement, ReviewEntity>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        SameAuthorRequirement requirement,
        ReviewEntity resource)
    {
        if (resource.User.Id == context.User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}