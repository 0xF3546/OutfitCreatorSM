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
    public class CreatorController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly Database _database;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CreatorController(UserManager<UserData> userManager, Database database, IWebHostEnvironment webHostEnvironment)
        {
            _userManager = userManager;
            _database = database;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("{apiKey}/create")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> Create(string apiKey, [FromBody] OutfitModel model)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (model.Id == null)
                model.Id = Guid.NewGuid().ToString();
            
            if (user == null)
                return NotFound("User not found");
            
            Outfit outfit = new()
            {
                Id = model.Id,
                Name = model.Name,
                Creator = user,
                Created = DateTime.Now,
            };
            _database.Outfits.Add(outfit);
            await _database.SaveChangesAsync();

            return Ok(new { Id = outfit.Id });
        }

        [HttpDelete("{apiKey}/{outfit}/delete")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> DeleteCreation(string apiKey, string outfit)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Outfit? o = await _database.Outfits.FirstOrDefaultAsync(x => x.Id == outfit && x.Creator == user);
            if (o == null)
                return NotFound("Outfit not found");
            
            Post? post = await _database.Posts.FirstOrDefaultAsync(p => p.Outfit == o);
            if (post != null)
            {
                List<Comment> comments = await _database.Comments.Where(c => c.Post == post).ToListAsync();
                foreach (Comment comment in comments)
                {
                    _database.Comments.Remove(comment);
                }
                List<Reaction> reactions = await _database.Reactions.Where(r => r.PostType == PostType.Post && r.PostId == post.Id).ToListAsync();
                foreach (Reaction reaction in reactions)
                {
                    _database.Reactions.Remove(reaction);
                }
                _database.Posts.Remove(post);
            }
            _database.Outfits.Remove(o);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{apiKey}/suggestion")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> GetSuggestion(string apiKey, [FromForm] SuggestionModel model)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (model.Components == null)
            {
                return NotFound("Components not found");
            }
            List<Component> components = [];
            if (model.Gender == null)
                model.Gender = "male";
            
            foreach (ComponentModel cm in model.Components)
            {
                Component? c = await _database.Components.FirstOrDefaultAsync(c => c.Id == cm.Id);
                if (c == null)
                {
                    continue;
                }
                components.Add(c);
            }

            SuggestionAlgorithm suggestion = new(components, model.Gender, _database.Components.ToList());
            Component? returnValue = suggestion.GetComponent();
            if (returnValue == null) return BadRequest("Component was invalid");
            ComponentModel returnModel = new()
            {
                Color = returnValue.Color,
                ComponentType = returnValue.ComponentType.ToString(),
                Creator = new()
                {
                    Image = returnValue.Creator.ImagePath,
                    UserName = returnValue.Creator.UserName,
                },
                Image = returnValue.Image,
                Gender = returnValue.Gender,
                Type = returnValue.ComponentType.ToString(),
                Name = returnValue.Name,
                Id = returnValue.Id,
            };

            return Ok(returnModel);
        }

        [HttpPost("{apiKey}/{post}/update")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> UpdateCreation(string apiKey, string post, [FromForm] OutfitModel model)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            Outfit? outfit = await _database.Outfits.FirstOrDefaultAsync(x => x.Id == post && x.Creator == user);
            if (outfit == null)
            {
                return NotFound("Outfit not found");
            }
            var image = model.FormFile;
            if (model.Name != null) outfit.Name = model.Name;
            if (model.Gender != null) outfit.Gender = model.Gender;
            if (model.Components != null)
            {
                List<Component> components = new();
                foreach (var component in model.Components)
                {
                    if (component == null)
                    {
                        continue;
                    }
                    Component? comp = await _database.Components.FirstOrDefaultAsync(c => c.Id == component.Id);
                    if (comp == null)
                    {
                        continue;
                    }
                    components.Add(comp);
                }
                outfit.Components = components;
            }
            if (model.Image == null) 
            {
                if (image != null)
                {
                    using var memoryStream = new MemoryStream();
                    await image.CopyToAsync(memoryStream);

                    var bytes = memoryStream.ToArray();
                    var base64 = Convert.ToBase64String(bytes);

                    using var httpClient = new HttpClient();

                    httpClient.DefaultRequestHeaders.Add("Authorization", "Client-ID {your-client-id}"); // Ersetze {your-client-id} durch deinen Imgur-Client-ID

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
                        if (imgurResponse == null) 
                        {
                            return BadRequest("Could not Upload Image");
                        }
                        if (imgurResponse.Data == null)
                        {
                            return BadRequest("Could not Upload Image");
                        }
                        outfit.Image = imgurResponse.Data.Link; // Der Link zum Bild auf Imgur
                    }
                }
            }
            else
            {
                outfit.Image = model.Image;
            }

            _database.Update(outfit);
            await _database.SaveChangesAsync();

            return Ok();
        }
    }
}
