namespace webapi.Models.Account
{
    public class UserModel
    {
        public string? UserName { get; set; }
        public string? Image { get; set; }
        public bool Public { get; set; }
        public IFormFile? ProfilePictureFile { get; set; }
        public bool IsAccountVerified { get; set; }
        public bool IsAccountDeactivated { get; set; }
    }
}
