namespace webapi.Models.Api
{
    public class RoleModel : BaseModel
    {
        public string? Name { get; set; }
        public int Permission {  get; set; }
        public IList<string> Permissions { get; set; } = new List<string>();
        public string? Color { get; set; }
    }
}
