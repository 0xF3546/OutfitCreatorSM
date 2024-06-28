using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Components;
using webapi.Components.Enums;
using webapi.Components.Identity;
using webapi.Components.Unnamed;
using webapi.Components.Utilities;
using webapi.Models.Api;
using webapi.Models.Chat;
using webapi.Models.Creator;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContentController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly Database _database;
        public ContentController(UserManager<UserData> userManager, Database database) 
        {
            _userManager = userManager;
            _database = database;
        }

        [HttpPost("{apiKey}/post", Name = "{apiKey}/post")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> Post(string apiKey, [FromBody] PostModel model)
        {
            if (string.IsNullOrEmpty(model.OutfitId))
                return NotFound("Outfit-Id not found");

            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return Unauthorized();

            var outfit = await _database.Outfits.FirstOrDefaultAsync(o => o.Id == model.OutfitId);
            if (outfit == null)
                return NotFound("Outfit not found");

            var post = new Post
            {
                Id = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.Now,
                Creator = user,
                Description = model.Description,
                IsPublic = true,
                Outfit = outfit,
                Name = outfit.Name
            };

            _database.Posts.Add(post);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{apiKey}/post/{post}/like", Name = "{apiKey}/post/{post}/like")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> LikePost(string apiKey, string post)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Reaction reaction = new()
            {
                Created = DateTime.Now,
                Type = ReactionType.Like,
                Id = Guid.NewGuid().ToString(),
                PostId = post,
                PostType = PostType.Post,
                User = user
            };
            _database.Reactions.Add(reaction);
            await _database.SaveChangesAsync();

            return Ok(true);
        }

        [HttpPost("{apiKey}/post/{post}/dislike", Name = "{apiKey}/post/{post}/dislike")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> DislikePost(string apiKey, string post)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Reaction? reaction = await _database.Reactions.FirstOrDefaultAsync(r => r.User == user && r.PostId == post && r.PostType == PostType.Post && r.Type == ReactionType.Like);
            if (reaction == null)
                return NotFound("Reaction not found");
            
            _database.Reactions.Remove(reaction);
            await _database.SaveChangesAsync();

            return Ok(false);
        }

        [HttpPost("{apiKey}/post/{post}/save", Name = "{apiKey}/post/{post}/save")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> SavePost(string apiKey, string post)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Reaction reaction = new()
            {
                Created = DateTime.Now,
                Type = ReactionType.Save,
                Id = Guid.NewGuid().ToString(),
                PostId = post,
                PostType = PostType.Post,
                User = user
            };
            _database.Reactions.Add(reaction);
            await _database.SaveChangesAsync();

            return Ok(true);
        }

        [HttpPost("{apiKey}/post/{post}/unsave", Name = "{apiKey}/post/{post}/unsave")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> UnsavePost(string apiKey, string post)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Reaction? reaction = await _database.Reactions.FirstOrDefaultAsync(r => r.User == user && r.PostId == post && r.PostType == PostType.Post && r.Type == ReactionType.Save);
            if (reaction == null)
                return NotFound("Reaction not found");

            _database.Reactions.Remove(reaction);
            await _database.SaveChangesAsync();

            return Ok(false);
        }

        [HttpPost("{apiKey}/post/{post}/toggleprivacy")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> ChangePrivacy(string apiKey, string post)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Post? p = await _database.Posts.FirstOrDefaultAsync(p => p.Outfit.Id == post && p.Creator == user);
            if (p == null)
                return NotFound("Post not found");
            
            p.IsPublic = !p.IsPublic;
            await _database.SaveChangesAsync();

            return Ok(p.IsPublic);
        }

        [HttpGet("{apiKey}/post/{post}")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> GetPost(string apiKey, string post)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Post? p = await _database.Posts
                .Include(p => p.Outfit)
                .ThenInclude(o => o.Components)
                .ThenInclude(c => c.Creator)
                .FirstOrDefaultAsync(p => p.Id == post);
            if (p == null)
                return NotFound("Post not found");
            
            if (p.Outfit == null)
                return NotFound("Outfit not found");
            
            List<ComponentModel> components = [];
            if (p.Outfit.Components != null)
            {
                foreach (Component c in p.Outfit.Components)
                {
                    ComponentModel cm = new()
                    {
                        ComponentType = c.ComponentType.ToString(),
                        Gender = c.Gender,
                        Id = c.Id,
                        Name = c.Name,
                        Image = c.Image,
                    };
                    components.Add(cm);
                }
            }
            if (p.Creator == null)
            {
                var po = await _database.Posts
                    .Include(p => p.Creator)
                    .FirstOrDefaultAsync(post => post.Id == p.Id);
                if (po == null) return NotFound();
                if (po.Creator == null) return NotFound();
                p.Creator = po.Creator;
            }
            PostModel model = new()
            {
                Id = p.Id,
                CreatedAt = p.CreatedAt,
                Creator = new()
                {
                    Image = p.Creator.ImagePath,
                    UserName = p.Creator.UserName,
                },
                Description = p.Description,
                HasReacted = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == p.Id),
                IsLiked = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == p.Id && r.Type == ReactionType.Like),
                IsSaved = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == p.Id && r.Type == ReactionType.Save),
                Outfit = new()
                {
                    Name = p.Outfit.Name,
                    Gender = p.Outfit.Gender,
                    Id = p.Outfit.Id,
                    Image = p.Outfit.Image,
                    Components = components
                },
            };

            return Ok(model);
        }

        [HttpGet("{apiKey}/{post}/comments")]
        [ApiKeyAuthorize]
        public IActionResult GetComments(string apiKey, string post)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];

            List<Comment> comments = _database.Comments.Include(c => c.Publisher).Where(c => c.Post.Id == post).ToList();

            List<CommentModel> models = [];

            foreach (Comment comment in comments)
            {
                models.Add(new()
                {
                    Id = comment.Id,
                    Created = comment.Created,
                    Text = comment.Text,
                    User = new()
                    {
                        Image = comment.Publisher.ImagePath,
                        UserName = comment.Publisher.UserName,
                    }
                });
            }

            return Ok(models);
        }

        [HttpPost("{apiKey}/{post}/comments/add")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> AddComment(string apiKey, string post, [FromBody] CommentModel model)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];

            Post? p = await _database.Posts.FirstOrDefaultAsync(p => p.Id == post);
            if (p == null )
                return NotFound("Post not found");
            
            Comment comment = new()
            {
                Id = Guid.NewGuid().ToString(),
                Publisher = user,
                Text = model.Text,
                Created = DateTime.Now,
                Post = p
            };
            _database.Comments.Add(comment);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{apiKey}/comments/{comment}/remove")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> RemoveComment(string apiKey, string comment)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Comment? c = await _database.Comments.FirstOrDefaultAsync(c => c.Id == comment && c.Publisher == user);
            if (c == null)
                return NotFound("Comment not found");
            
            _database.Comments.Remove(c);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{apiKey}/{target}")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> GetTargetContent(string apiKey, string target)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];

            var targetUser = await _userManager.FindByNameAsync(target);

            var posts = _database.Posts.Where(p => p.Creator == targetUser && p.IsPublic);

            var postsModel = posts.Select(post => new PostModel
            {
                CreatedAt = post.CreatedAt,
                Creator = new()
                {
                    Image = post.Creator.ImagePath,
                    UserName = post.Creator.ImagePath
                },
                Id = post.Id,
                IsPublic = post.IsPublic,
                Description = post.Description,
                HasReacted = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id),
                IsLiked = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id && r.Type == ReactionType.Like),
                IsSaved = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id && r.Type == ReactionType.Save),
                Outfit = new()
                {
                    Id = post.Outfit.Id,
                    Gender = post.Outfit.Gender,
                    Name = post.Outfit.Name,
                    Image = post.Outfit.Image
                },
                Likes = post.Reactions.Where(r => r.Type == ReactionType.Like).ToList().Count
            }).ToList();

            return Ok(postsModel);
        }


        [HttpGet("{apiKey}/gethomebyfollowing")]
        [ApiKeyAuthorize]
        public IActionResult GetHomeByFollowing(string apiKey)
        {
            var user = (UserData?)HttpContext.Items["User"];

            var follows = _database.Follows.Where(f => f.UserWhichIsTheFollower == user);
            var posts = _database.Posts.Where(u => u.Creator == user && u.IsPublic)
                .Concat(follows.SelectMany(f => _database.Posts.Where(u => u.Creator == f.UserWhoHasTheFollower && u.IsPublic)));

            var postsModel = posts.Select(post => new PostModel
            {
                CreatedAt = post.CreatedAt,
                Creator = new()
                {
                    UserName = post.Creator.UserName,
                    Image = post.Creator.ImagePath
                },
                Id = post.Id,
                IsPublic = post.IsPublic,
                Description = post.Description,
                HasReacted = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id),
                IsLiked = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id && r.Type == ReactionType.Like),
                IsSaved = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id && r.Type == ReactionType.Save),
                Outfit = new()
                {
                    Id = post.Outfit.Id,
                    Gender = post.Outfit.Gender,
                    Name = post.Outfit.Name,
                    Image = post.Outfit.Image
                }
            }).ToList();


            return Ok(postsModel);
        }

        [HttpGet("{apiKey}/explore")]
        [ApiKeyAuthorize]
        public IActionResult GetExplore(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];

            var follows = _database.Follows.Where(f => f.UserWhichIsTheFollower == user);
            var posts = _database.Posts.Where(u => u.Creator == user && u.IsPublic)
                .Concat(follows.SelectMany(f => _database.Posts.Where(u => u.Creator == f.UserWhoHasTheFollower && u.IsPublic)));

            var postsModel = posts.Select(post => new PostModel
            {
                CreatedAt = post.CreatedAt,
                Creator = new()
                {
                    Image = post.Creator.ImagePath,
                    UserName = post.Creator.UserName
                },
                Id = post.Id,
                IsPublic = post.IsPublic,
                Description = post.Description,
                HasReacted = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id),
                IsLiked = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id && r.Type == ReactionType.Like),
                IsSaved = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id && r.Type == ReactionType.Save),
                Outfit = new()
                {
                    Id = post.Outfit.Id,
                    Gender = post.Outfit.Gender,
                    Name = post.Outfit.Name,
                    Image = post.Outfit.Image
                },
                Likes = post.Reactions.Where(r => r.Type == ReactionType.Like).ToList().Count
            }).ToList();

            return Ok(postsModel);
        }

        [HttpGet("{apiKey}/saved")]
        [ApiKeyAuthorize]
        public IActionResult GetSaved(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];

            var follows = _database.Follows.Where(f => f.UserWhichIsTheFollower == user);
            var posts = _database.Posts
                .Include(p => p.Outfit)
                .Where(post => post.Reactions.Any(reaction =>
                    reaction.Type == ReactionType.Save && reaction.User == user));

            if (posts == null)
                return Ok(new List<PostModel>());

            var postsModel = posts.Select(post => new PostModel
            {
                CreatedAt = post.CreatedAt,
                Creator = new()
                {
                    Image = post.Creator.ImagePath,
                    UserName = post.Creator.UserName
                },
                Id = post.Id,
                IsPublic = post.IsPublic,
                Description = post.Description,
                HasReacted = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id),
                IsLiked = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id && r.Type == ReactionType.Like),
                IsSaved = _database.Reactions.Any(r => r.User == user && r.PostType == PostType.Post && r.PostId == post.Id && r.Type == ReactionType.Save),
                Outfit = new()
                {
                    Id = post.Outfit.Id,
                    Gender = post.Outfit.Gender,
                    Name = post.Outfit.Name,
                    Image = post.Outfit.Image
                },
                Likes = post.Reactions.Where(r => r.Type == ReactionType.Like).ToList().Count
            }).ToList();

            return Ok(postsModel);
        }
    }
}
