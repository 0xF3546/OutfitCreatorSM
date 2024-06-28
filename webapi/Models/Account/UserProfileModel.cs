namespace webapi.Models.Account
{
    public class UserProfileModel
    {
        public string? UserName { get; set; }
        public string? Image { get; set; }
        public List<UserModel> Follower { get; set; } = new List<UserModel>();
        public List<UserModel> Follows { get; set; } = new List<UserModel>();
        public bool IsUserFollower { get; set; }
    }
}
