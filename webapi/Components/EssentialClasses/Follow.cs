using webapi.Components.EssentialClasses;
using webapi.Components.Identity;

namespace webapi.Components.Unnamed
{
    public class Follow : BaseClass
    {
        public UserData UserWhichIsTheFollower { get; set; }
        public UserData UserWhoHasTheFollower { get; set; }
        public DateTime Created { get; set; }
    }
}
