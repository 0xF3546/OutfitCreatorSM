using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Components;
using webapi.Components.Identity;
using webapi.Components.Utilities;
using webapi.Models.Account;
using webapi.Models.Api;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly Database _database;
        private readonly RoleManager<RoleData> _roleManager;
        public AdminController(Database database, UserManager<UserData> userManager, RoleManager<RoleData> roleManager)
        {
            _database = database;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("{apiKey}/users")]
        [ApiKeyAuthorize]
        public IActionResult LoadUsers(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            return Ok(_userManager.Users.ToList());
        }

        [HttpGet("{apiKey}/user/{target}")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> LoadUsers(string apiKey, string target)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];

            UserData? targetUser = await _userManager.FindByNameAsync(target);
            if (targetUser == null)
                return NotFound("User not found");

            return Ok(targetUser);
        }

        [HttpPost("{apiKey}/mail/send")]
        [ApiKeyAuthorize]
        public IActionResult SendMail(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            return Ok();
        }

        [HttpPost("{apiKey}/mail/sendall")]
        [ApiKeyAuthorize]
        public IActionResult SendMailAll(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            return Ok();
        }

        [HttpPost("{apiKey}/{target}/update")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> UpdateUser(string apiKey, string target, [FromBody] UserModel model)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");

            UserData? targetData = await _userManager.FindByNameAsync(target);
            if (targetData == null)
                return NotFound("Target not found");
            
            targetData.IsAccountDeactivated = model.IsAccountDeactivated;
            targetData.IsAccountVerified = model.IsAccountVerified;
            await _userManager.UpdateAsync(targetData);

            return Ok();
        }

        [HttpPost("{apiKey}/role/add")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> AddRole(string apiKey, [FromBody] RoleModel model)
        {
            var user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            
            if (model.Name == null)
                return NotFound("Role-Name not found");
            
            RoleData data = new()
            {
                Id = Guid.NewGuid().ToString(),
                Permission = model.Permission,
                Name = model.Name,
                NormalizedName = model.Name.Normalize()
            };
            await _roleManager.CreateAsync(data);

            return Ok();
        }

        [HttpPost("{apiKey}/{target}/role/{roleId}/add")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> AddRoleToUser(string apiKey, string target, string roleId)
        {
            var user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            
            RoleData? role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
                return NotFound("Role not found");
            

            UserData? targetUser = await _userManager.FindByNameAsync(target);
            if (targetUser == null)
                return NotFound("Target not found");
            
            if (role.Name == null)
                return NotFound("Role-Name not found");
            
            await _userManager.AddToRoleAsync(targetUser, role.Name);

            return Ok();
        }

        [HttpDelete("{apiKey}/{target}/role/{roleId}/remove")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> RemoveRoleFromUser(string apiKey, string target, string roleId)
        {
            var user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            
            RoleData? role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
                return NotFound("Role not found");
            

            UserData? targetUser = await _userManager.FindByNameAsync(target);
            if (targetUser == null)
                return NotFound("Target not found");
            
            if (role.Name == null)
                return NotFound("Role-Name not found");
            
            await _userManager.RemoveFromRoleAsync(targetUser, role.Name);

            return Ok();
        }
    }
}