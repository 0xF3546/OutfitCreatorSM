using Microsoft.AspNetCore.Identity;

namespace webapi.Components.Identity
{
    public class RoleData : IdentityRole
    {
        public int Permission {  get; set; }
        public IList<string> Permissions { get; set; } = new List<string>();
        public string? Color { get; set; }
    }
}
