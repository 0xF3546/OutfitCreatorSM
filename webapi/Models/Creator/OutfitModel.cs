namespace webapi.Models.Creator
{
    public class OutfitModel : BaseModel
    {
        public string? Name { get; set; }
        public string? Image {  get; set; }
        public string? Gender { get; set; }
        public bool IsUploaded { get; set; }
        public IFormFile? FormFile { get; set; }
        public List<ComponentModel> Components { get; set; } = new List<ComponentModel>();
        public string? ComponentListAsString { get; set; }
    }
}