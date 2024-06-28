using Microsoft.AspNetCore.Identity;

namespace webapi.Components.Identity
{
    public class UserData : IdentityUser
    {
        public string? ImagePath { get; set; }
        public bool IsAccountDeactivated { get; set; }
        public bool IsAccountPublic { get; set; }
        public string? ApiKey { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? LastOnline { get; set; }
        public bool IsAccountVerified { get; set; }
    }
}
