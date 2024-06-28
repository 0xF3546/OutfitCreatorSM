using webapi.Models.Account;

namespace webapi.Models.Chat
{
    public class CommentModel : BaseModel
    {
        public string Text { get; set; }
        public string? Post {  get; set; }
        public DateTime? Created { get; set; }
        public UserModel? User { get; set; }
    }
}
