using webapi.Components.EssentialClasses;
using webapi.Components.Identity;

namespace webapi.Components.Unnamed
{
    public class Post : BaseClass
    {
        public bool IsPublic { get; set; }
        public ICollection<Reaction>? Reactions { get; set; }
        public DateTime? CreatedAt { get; set; }
        public Outfit? Outfit { get; set; }
        public UserData? Creator { get; set; }
        public string? Description { get; set; }
        public string? Name { get; set; }
    }
}
