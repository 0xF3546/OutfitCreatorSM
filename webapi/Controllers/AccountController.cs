using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Components.Identity;
using webapi.Components.Utilities;
using webapi.Models.Account;
using webapi.Services;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly SignInManager<UserData> _signInManager;
        private readonly IEmailService _emailService;
        public AccountController(UserManager<UserData> userManager, SignInManager<UserData> signInManager, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
        }

        [HttpGet("{apiKey}/User", Name = "User")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> GetUserAsync(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            

            user.LastOnline = DateTime.Now;
            await _userManager.UpdateAsync(user);
            return Ok(user);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (model.UserName == null) return NotFound("UserName not found");
            if (model.Password == null) return NotFound("Password not found");
            UserData? user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                user.ApiKey = Guid.NewGuid().ToString();
                user.LastLogin = DateTime.Now;
                await _userManager.UpdateAsync(user);

                return Ok(new
                {
                    token = user.ApiKey
                });
            }

            return Unauthorized();
        }

        [HttpPost("LoginViaService")]
        public async Task<IActionResult> LoginViaService(LoginViewModel model)
        {
            if (model.UserName == null) return NotFound("UserName not found");
            if (model.Password == null) return NotFound("Password not found");
            UserData? user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                user.ApiKey = Guid.NewGuid().ToString();
                user.LastLogin = DateTime.Now;
                await _userManager.UpdateAsync(user);

                return Ok(new
                {
                    token = user.ApiKey
                });
            }

            return Unauthorized();
        }


        [HttpPost("Register", Name = "Register")]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                UserData? user = new() { 
                    UserName = model.UserName,
                    Email = model.Email,
                    CreatedAt = DateTime.Now,
                    LastLogin = DateTime.Now
                };

                if (model.Password == null) return NotFound("Password not found");

                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return Ok();
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            return BadRequest();
        }

        [HttpPost("ResetPassword", Name = "ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordModel model)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                return BadRequest("No Email was provided");
            }
            UserData? user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Email not found");
            }
            string? token = await _userManager.GeneratePasswordResetTokenAsync(user);
            await _emailService.SendAsync(model.Email, "Reset Password", $"Hey {user.UserName},<br><br>Your Password-Reset-Token is:<br>{token}");

            return Ok();
        }

        [HttpPost("ChangePassword", Name = "ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            if (string.IsNullOrEmpty(model.Email)) return BadRequest("Email not found");
            if (string.IsNullOrEmpty(model.Token)) return BadRequest("Token not found");
            if (string.IsNullOrEmpty(model.Password)) return BadRequest("Password not found");
            UserData? user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            return Ok();
        }
    }
}
