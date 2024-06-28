using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Components;
using webapi.Components.Identity;
using webapi.Components.Unnamed;
using webapi.Components.Utilities;
using webapi.Models.Chat;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessagesController : Controller
    {
        private readonly UserManager<UserData> _userManager;
        private readonly Database _database;
        public MessagesController(UserManager<UserData> userManager, Database database)
        {
            _userManager = userManager;
            _database = database;
        }

        [HttpPost("{apiKey}/new/{target}")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> AddChat(string apiKey, string target)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            
            UserData? targetData = await _userManager.FindByNameAsync(target);
            if (targetData == null)
                return NotFound("Target not found");
            
            Chat? chat = await _database.Chats.FirstOrDefaultAsync(c => c.Member.Contains(user) && c.Member.Contains(targetData));
            List<object> messages = [];
            if (chat != null)
            {
                foreach (Message msg in _database.Messages)
                {
                    if (msg.Chat == chat)
                    {
                        var message = new
                        {
                            Id = msg.Id,
                            Text = msg.Text,
                            Send = msg.Send,
                            Sender = msg.Sender.UserName,
                            Reactions = new List<string>()
                        };
                        messages.Add(message);
                    }
                }
                return Ok(messages);
            }
            chat = new Chat
            {
                Id = Guid.NewGuid().ToString(),
                Member = new List<UserData>(),
                Messages = new List<Message>(),
            };
            chat.Member.Add(user);
            chat.Member.Add(targetData);
            await _database.Chats.AddAsync(chat);
            await _database.SaveChangesAsync();

            return Ok(new List<object>());
        }

        [HttpPost("{apiKey}/{chat}/add")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> AddChatMessage(string apiKey, string chat, [FromBody] MessageModel data)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            
            UserData? targetData = await _userManager.FindByNameAsync(chat);
            if (targetData == null)
                return NotFound("Target user not found");
            
            Chat? c = await _database.Chats.FirstOrDefaultAsync(c => c.Member.Contains(user) && c.Member.Contains(targetData));
            if (c == null)
                return NotFound("Chat not found");
            
            Message msg = new()
            {
                Id = Guid.NewGuid().ToString(),
                Send = DateTime.Now,
                Sender = user,
                Text = data.Message,
                Chat = c,
            };
            c.Messages ??= new List<Message>();
            
            c.Messages.Add(msg);

            await _database.Messages.AddAsync(msg);
            _database.Chats.Update(c);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{apiKey}/{chat}/{message}/remove")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> RemoveChatMessage(string apiKey, string message, string chat)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            
            UserData? targetData = await _userManager.FindByNameAsync(chat);
            if (targetData == null)
                return NotFound("Target user not found");
            
            Message? msg = await _database.Messages.FirstOrDefaultAsync(c => c.Id == message);
            if (msg == null)
                return NotFound("Message not found");

            if (msg.Chat != null)
            {
                msg.Chat.Messages.Remove(msg);
                _database.Chats.Update(msg.Chat);
            }
            
            if (msg == null)
                return NotFound("Message not found");
            
            _database.Messages.Remove(msg);
            await _database.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{apiKey}/{chat}/load")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> LoadChatMessages(string apiKey, string chat)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            UserData? target = await _userManager.FindByNameAsync(chat);
            if (target == null)
                return NotFound();

            if (user == null) return NotFound("User not found");
            
            Chat? c = await _database.Chats.FirstOrDefaultAsync(c => c.Member.Contains(user) && c.Member.Contains(target));
            if (c == null)
                return NotFound("Chat not found");

            return Ok(c.Messages);
        }

        [HttpGet("{apiKey}/load")]
        [ApiKeyAuthorize]
        public async Task<IActionResult> LoadChats(string apiKey)
        {
            UserData? user = (UserData?)HttpContext.Items["User"];
            if (user == null)
                return NotFound("User not found");
            
            List<Chat> chats = await _database.Chats
            .Include(c => c.Member)
            .Where(c => c.Member.Contains(user))
            .ToListAsync();

            List<ChatUserModel> targets = [];
            foreach (Chat chat in chats)
            {
                if (chat.Member == null)
                    continue;
                
                foreach (UserData testData in chat.Member)
                {
                    if (testData == null)
                        continue;
                    
                    if (testData.UserName != user.UserName)
                    {
                        targets.Add(new ChatUserModel
                        {
                            LastOnline = testData.LastOnline,
                            Name = testData.UserName,
                            Image = testData.ImagePath
                        });
                    }
                }
            }

            return Ok(targets);
        }
    }
}
