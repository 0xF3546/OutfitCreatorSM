using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Components;
using webapi.Components.Identity;
using webapi.Components.Unnamed;
using webapi.Components.Utilities;
using webapi.Models.Account;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly Database _database;
        public ProfileController(UserManager<UserData> userManager, Database database)
        {
            _userManager = userManager;
            _database = database;
        }

        [HttpGet("{apiKey}/{target}/follow")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> FollowUser(string apiKey, string target)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            UserData? targetData = await _userManager.FindByNameAsync(target);
            if (user == null)
                return NotFound("User not found");
            
            if (targetData == null)
                return NotFound("Target-user not found");
            

            Follow follow = new()
            {
                Created = DateTime.Now,
                Id = Guid.NewGuid().ToString(),
                UserWhichIsTheFollower = user,
                UserWhoHasTheFollower = targetData
            };
            _database.Follows.Add(follow);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{apiKey}/{target}/unfollow")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> UnfollowUser(string apiKey, string target)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            UserData? targetData = await _userManager.FindByNameAsync(target);
            if (targetData == null)
                return NotFound("Target-user not found");
            

            Follow? follow = await _database.Follows.FirstOrDefaultAsync(f => f.UserWhichIsTheFollower == user && f.UserWhoHasTheFollower == targetData);
            
            if (follow == null)
                return NotFound("Follow not found");
            

            _database.Follows.Remove(follow);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{apiKey}/follower")]
        [ApiKeyAuthorize]
        public IActionResult GetFollower(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            List<string> followerNames = new List<string>();
            foreach (Follow follow in _database.Follows)
            {
                if (user == null) continue;
                if (follow.UserWhoHasTheFollower.UserName == user.UserName)
                {
                    if (follow.UserWhichIsTheFollower.UserName == null) continue;
                    followerNames.Add(follow.UserWhichIsTheFollower.UserName);
                }
            }

            return Ok(followerNames);
        }

        [HttpGet("{apiKey}/following")]
        [ApiKeyAuthorize]
        public IActionResult GetFollowing(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            IList<string> followerNames = new List<string>();
            foreach (Follow follow in _database.Follows)
            {
                if (user == null) continue;
                if (follow.UserWhichIsTheFollower.UserName == user.UserName)
                {
                    if (follow.UserWhoHasTheFollower.UserName == null) continue;
                    followerNames.Add(follow.UserWhoHasTheFollower.UserName);
                }
            }

            return Ok(followerNames);
        }

        [HttpGet("{apiKey}/{target}")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> GetProfileOfTarget(string apiKey, string target)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            

            var returnAbleUser = await _userManager.FindByNameAsync(target);
            if (returnAbleUser == null)
                return NotFound("Target-user not found");
            

            var followerList = _database.Follows
                .Where(f => f.UserWhoHasTheFollower == returnAbleUser)
                .Select(f => new UserModel
                {
                    Image = f.UserWhichIsTheFollower.ImagePath,
                    UserName = f.UserWhichIsTheFollower.UserName
                })
                .ToList();

            var followsList = _database.Follows
                .Where(f => f.UserWhichIsTheFollower == returnAbleUser)
                .Select(f => new UserModel
                {
                    Image = f.UserWhoHasTheFollower.ImagePath,
                    UserName = f.UserWhoHasTheFollower.UserName
                })
                .ToList();

            var model = new UserProfileModel
            {
                UserName = returnAbleUser.UserName,
                Image = returnAbleUser.ImagePath,
                Follower = followerList,
                IsUserFollower = followerList.Any(f => f.UserName == user.UserName),
                Follows = followsList
            };

            return Ok(model);
        }


        [HttpPost("{apiKey}/update")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> UpdateUserProfile(string apiKey, [FromForm] UserModel model)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("Not found");
            
            if (model == null)
                return NotFound("Model not found");
            
            if (!string.IsNullOrEmpty(model.UserName)) 
            {
                UserData? data = await _userManager.FindByNameAsync(model.UserName);
                if (data == null)
                {
                    user.UserName = model.UserName;
                }
            }
            if (!string.IsNullOrEmpty(model.Image))
            {
                user.ImagePath = model.Image;
            }
            await _userManager.UpdateAsync(user);

            return Ok();
        }
    }
}
