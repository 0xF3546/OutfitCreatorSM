using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;
using webapi.Components;
using webapi.Components.Enums;
using webapi.Components.Identity;
using webapi.Components.Unnamed;
using webapi.Components.Utilities;
using webapi.Models.Creator;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ComponentController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly Database _database;
        public ComponentController(UserManager<UserData> userManager, Database database) 
        {
            _userManager = userManager;
            _database = database;
        }

        [HttpGet]
        [ApiKeyAuthorize]
        public async Task<IActionResult> GetComponents()
        {
            return Ok(await _database.Comments.AsNoTracking().ToListAsync());
        }

        [HttpGet("types")]
        public IActionResult GetComponentTypes()
        {
            string[] componentTypeNames = Enum.GetNames(typeof(ComponentType));

            return Ok(componentTypeNames);
        }

        [HttpGet("{apiKey}")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> GetUserComponents(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            

            return Ok(await _database.Components.AsNoTracking().Where(c => c.Creator == user).ToListAsync());
        }

        [HttpPost("{apiKey}/add")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> AddComponent(string apiKey, [FromBody] ComponentModel model)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");

            if (model.ComponentType == null)
                return NotFound("Component-Type not found");
            

            ComponentType componentType = (ComponentType)Enum.Parse(typeof(ComponentType), model.ComponentType);
            Component component = new()
            {
                Id = Guid.NewGuid().ToString(),
                Created = DateTime.Now,
                Gender = model.Gender,
                Creator = user,
                Name = model.Name,
                ComponentType = componentType
            };
            ComponentModel cModel = new()
            {
                Id = component.Id,
            };

            _database.Components.Add(component);
            await _database.SaveChangesAsync();

            return Ok(cModel);
        }

        [HttpDelete("{apiKey}/{component}/delete")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> DeleteComponent(string apiKey, string component)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");

            Component? c = await _database.Components.FirstOrDefaultAsync(c => c.Id == component && c.Creator == user);
            if (c == null)
                return NotFound("Not found");

            _database.Components.Remove(c);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{apiKey}/matching")]
        [ApiKeyAuthorize]
        public IActionResult GetMatchingComponent(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            return Ok();
        }

        [HttpGet("{apiKey}/{type}/{gender}")]
        [ApiKeyAuthorize]
        public IActionResult GetByType(string apiKey, string type, string gender)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (Enum.TryParse(type, true, out ComponentType clothingType))
            {
                List<Component> clothesByType = _database.Components.Where(c => c.ComponentType == clothingType && (c.Gender == gender || c.Gender == "both")).ToList();
                
                List<ComponentModel> models = new List<ComponentModel>();

                foreach (Component component in clothesByType)
                {
                    ComponentModel model = new()
                    {
                        ComponentType = component.ComponentType.ToString(),
                        Gender = component.Gender.ToString(),
                        Name = component.Name,
                        Image = component.Image,
                        Id = component.Id
                    };
                    models.Add(model);
                }
                
                return Ok(models);
            }
            else
            {
                return BadRequest($"Invalid type: {type}");
            }
        }

        [HttpGet("{apiKey}/{comp}/load")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> GetHomeScreen(string apiKey, string comp)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Component? component = await _database.Components.Include(c => c.Creator).FirstOrDefaultAsync(c => c.Id == comp);
            if (component == null)
                return NotFound("Component not found");

            ComponentModel model = new()
            {
                Id = component.Id,
                ComponentType = component.ComponentType.ToString(),
                Gender = component.Gender.ToString(),
                Image = component.Image,
                Name = component.Name,
                Color = component.Color,
                Created = component.Created,
                Creator = new()
                {
                    Image = component.Creator.ImagePath,
                    UserName = component.Creator.UserName,
                }
            };

            return Ok(model);
        }

        [HttpPost("{apiKey}/{post}/update")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> UpdateCreation(string apiKey, string post, [FromForm] ComponentModel model)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Component? component = await _database.Components.FirstOrDefaultAsync(x => x.Id == post && x.Creator == user);
            if (component == null)
                return NotFound("Component not found");

            var image = model.FormFile;
            if (model.Name != null) component.Name = model.Name;
            if (model.Gender != null) component.Gender = model.Gender;
            if (model.Color != null) component.Color = "#000000";
            if (!string.IsNullOrEmpty(model.ComponentType))
                component.ComponentType = (ComponentType)Enum.Parse(typeof(ComponentType), model.ComponentType);
            if (model.Image == null)
            {
                if (image != null)
                {
                    using var memoryStream = new MemoryStream();
                    await image.CopyToAsync(memoryStream);

                    var bytes = memoryStream.ToArray();
                    var base64 = Convert.ToBase64String(bytes);

                    using var httpClient = new HttpClient();

                    httpClient.DefaultRequestHeaders.Add("Authorization", "Client-ID {your-client-id}");

                    var content = new StringContent(
                        JsonConvert.SerializeObject(new { image = base64 }),
                        Encoding.UTF8,
                        "application/json"
                    );

                    var response = await httpClient.PostAsync("https://api.imgur.com/3/image", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        var imgurResponse = JsonConvert.DeserializeObject<ImgurResponse>(responseContent);
                        if (imgurResponse != null && imgurResponse.Data != null)
                            component.Image = imgurResponse.Data.Link;
                    }
                }
            }
            else
            {
                component.Image = model.Image;
            }

            _database.Components.Update(component);
            await _database.SaveChangesAsync();

            return Ok();
        }
    }
}
