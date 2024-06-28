using webapi.Components.EssentialClasses;
using webapi.Components.Identity;

namespace webapi.Components.Unnamed
{
    public class Comment : BaseClass
    {
        public UserData? Publisher { get; set; }
        public string? Text { get; set; }
        public DateTime Created {  get; set; }
        public Post? Post { get; set; }
    }
}