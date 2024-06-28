using webapi.Components.EssentialClasses;
using webapi.Components.Identity;

namespace webapi.Components.Unnamed
{
    public class Outfit : BaseClass
    {
        public string? Name { get; set; }
        public ICollection<Component>? Components { get; set; }
        public UserData Creator { get; set; }
        public string? Gender { get; set; }
        public DateTime Created {  get; set; }
        public DateTime LastUpdated { get; set; }
        public string? Image { get; set; }
    }
}