using webapi.Models.Account;
using webapi.Models.Creator;

namespace webapi.Models.Api
{
    public class PostModel : BaseModel
    {
        public bool IsPublic { get; set; }
        public DateTime? CreatedAt { get; set; }
        public OutfitModel? Outfit { get; set; }
        public UserModel? Creator { get; set; }
        public string? Description { get; set; }
        public string? OutfitId { get; set; }
        public string? Name{ get; set; }
        public bool HasReacted { get; set; }
        public bool IsLiked { get; set; }
        public int Likes { get; set; }
        public bool IsSaved { get; set; }
    }
}
