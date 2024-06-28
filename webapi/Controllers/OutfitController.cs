using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Components;
using webapi.Components.Enums;
using webapi.Components.Identity;
using webapi.Components.Unnamed;
using webapi.Components.Utilities;
using webapi.Models.Api;
using webapi.Models.Creator;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OutfitController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly Database _database;
        public OutfitController(UserManager<UserData> userManager, Database database)
        {
            _userManager = userManager;
            _database = database;
        }

        [HttpGet("{apiKey}/load")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> LoadOutfits(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            List<OutfitModel> models = [];
            foreach (Outfit outfit in _database.Outfits)
            {
                if (outfit.Creator == user)
                {
                    Post? post = await _database.Posts.FirstOrDefaultAsync(p => p.Outfit == outfit);
                    OutfitModel model = new()
                    {
                        Id = outfit.Id,
                        Name = outfit.Name,
                        IsUploaded = (post != null),
                        Gender = outfit.Gender,
                        Image = outfit.Image
                    };
                    models.Add(model);
                }
            }

            return Ok(models);
        }

        [HttpGet("{apiKey}/{outfitId}/load")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> LoadOutfit(string apiKey, string outfitId)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Outfit? outfit = await _database.Outfits.Include(o => o.Components).FirstOrDefaultAsync(o => o.Id == outfitId);
            if (outfit == null)
                return NotFound("Post not found");
            
            List<ComponentModel> components = new List<ComponentModel>();
            if (outfit.Components != null)
            {
                foreach (Component c in outfit.Components)
                {
                    c.Gender ??= Gender.Both.ToString();
                    ComponentModel m = new()
                    {
                        ComponentType = c.ComponentType.ToString(),
                        Gender = c.Gender.ToString(),
                        Id = c.Id,
                        Name = c.Name,
                        Image = c.Image
                    };
                    components.Add(m);
                }
            }
            OutfitModel model = new()
            {
                Id = outfit.Id,
                Name = outfit.Name,
                Gender = outfit.Gender,
                Image = outfit.Image,
                Components = components
            };

            return Ok(model);
        }

        [HttpGet("{apiKey}/post/{postId}/load")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> LoadPost(string apiKey, string postId)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Post? post = await _database.Posts.FirstOrDefaultAsync(p => p.Id == postId);
            if (post == null)
                return NotFound("Post not found");

            if (post.Creator == null)
                return NotFound("Post not found");

            if (post.Outfit == null)
                return NotFound("Outfit not found");
            
            PostModel model = new()
            {
                CreatedAt = post.CreatedAt,
                Creator = new()
                {
                    Image = post.Creator.ImagePath,
                    UserName = post.Creator.UserName,
                },
                Description = post.Description,
                Name = post.Name,
                Outfit = new()
                {
                    Id = post.Outfit.Id,
                    Gender = post.Outfit.Gender,
                    Image = post.Outfit.Image,
                },
                Id = post.Id,
            };

            return Ok(model);
        }

        [HttpGet("/lastuploaded")]
        public IActionResult GetLastUploaded()
        {
            IndexOutfitModel model = new();
            List<IndexOutfitModel> models = [];
            foreach (Outfit outfit in _database.Outfits)
            {
            }

            return Ok();
        }
    }
}
