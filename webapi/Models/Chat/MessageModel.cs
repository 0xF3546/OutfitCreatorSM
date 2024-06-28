namespace webapi.Models.Chat
{
    public class MessageModel
    {
        public string? Message { get; set; }
        public List<string>? Reactions { get; set; }
    }
}
