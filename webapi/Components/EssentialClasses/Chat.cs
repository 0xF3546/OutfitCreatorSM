using webapi.Components.EssentialClasses;
using webapi.Components.Identity;

namespace webapi.Components.Unnamed
{
    public class Chat : BaseClass
    {
        public ICollection<UserData>? Member {  get; set; }
        public ICollection<Message>? Messages { get; set; }
    }
}
