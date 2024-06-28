using webapi.Models.Account;

namespace webapi.Models.Creator
{
    public class ComponentModel : BaseModel
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public string? Gender { get; set; }
        public string? ComponentType { get; set; }
        public string? Image {  get; set; }
        public IFormFile? FormFile { get; set; }
        public string? Color { get; set; }
        public UserModel? Creator {  get; set; }
        public DateTime? Created { get; set; }
    }
}
