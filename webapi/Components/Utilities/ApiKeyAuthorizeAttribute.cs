using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using webapi.Components.Identity;
using Microsoft.EntityFrameworkCore;

namespace webapi.Components.Utilities
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ApiKeyAuthorizeAttribute : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var apiKey = context.RouteData.Values["apiKey"]?.ToString();

            if (string.IsNullOrEmpty(apiKey))
            {
                context.Result = new BadRequestObjectResult("API key is missing");
                return;
            }

            UserManager<UserData>? userManager = (UserManager<UserData>?)context.HttpContext.RequestServices.GetService(typeof(UserManager<UserData>));
            if (userManager == null)
            {
                context.Result = new BadRequestObjectResult("No UserManager found");
                return;
            }
            UserData? user = await userManager.Users.FirstOrDefaultAsync(u => u.ApiKey == apiKey);
            if (user == null)
            {
                context.Result = new UnauthorizedObjectResult("Invalid API key");
                return;
            }

            context.HttpContext.Items["User"] = user;

            await next();
        }
    }
}
