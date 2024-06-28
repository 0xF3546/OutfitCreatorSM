using webapi.Components.Enums;
using webapi.Components.EssentialClasses;
using webapi.Components.Identity;

namespace webapi.Components.Unnamed
{
    public class Component : BaseClass
    {
        public string? Name { get; set; }
        public ComponentType ComponentType { get; set; }
        public string? Color { get; set; }
        public string? Gender { get; set; }
        public DateTime Created {  get; set; }
        public UserData Creator { get; set; }
        public string? Image {  get; set; }
    }
}
