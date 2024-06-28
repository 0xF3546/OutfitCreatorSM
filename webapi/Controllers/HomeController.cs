using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Components;
using webapi.Components.Identity;
using webapi.Components.Unnamed;
using webapi.Models.Api;

namespace webapi.Controllers
{
    [ApiController]
    public class HomeController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly Database _database;
        public HomeController(UserManager<UserData> userManager, Database database)
        {
            _userManager = userManager;
            _database = database;
        }

        [HttpGet("search/query={query}")]
        public IActionResult Search(string query)
        {
            query = query.ToLower();
            List<UserData> users = _database.Users.Where(u => u.UserName.ToLower().Contains(query)).ToList();
            List<Post> posts = _database.Posts
                .Include(p => p.Outfit)
                .Where(p => p.Outfit.Name.ToLower().Contains(query)).ToList();

            List<SearchModel> searchModels = [];

            foreach (var user in users)
            {
                SearchModel searchModel = new()
                {
                    Name = user.UserName,
                    Path = $"/u/{user.UserName}",
                    Type = "User"
                };
                searchModels.Add(searchModel);
            }

            foreach (var post in posts)
            {
                if (post.Outfit == null)
                    continue;
                
                SearchModel searchModel = new()
                {
                    Name = post.Outfit.Name,
                    Path = $"/o/{post.Id}",
                    Type = "Post"
                };
                searchModels.Add(searchModel);
            }

            return Ok(searchModels);
        }
    }
}
