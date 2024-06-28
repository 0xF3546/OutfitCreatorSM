using webapi.Components.Enums;
using webapi.Components.EssentialClasses;
using webapi.Components.Identity;

namespace webapi.Components.Unnamed
{
    public class Reaction : BaseClass
    {
        public UserData? User { get; set; }
        public ReactionType Type { get; set; }
        public DateTime? Created { get; set; }
        public PostType PostType{ get; set; }
        public string? PostId { get; set; }
    }
}
