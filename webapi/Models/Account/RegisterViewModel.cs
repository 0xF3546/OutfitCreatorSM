namespace webapi.Models.Account
{
    public class RegisterViewModel : BaseAccountModel
    {
        public string? Email { get; set; }
        public string? ConfirmPassword { get; set; }
    }
}
