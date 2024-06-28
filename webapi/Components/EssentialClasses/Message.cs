using webapi.Components.EssentialClasses;
using webapi.Components.Identity;

namespace webapi.Components.Unnamed
{
    public class Message : BaseClass
    {
        public string Text { get; set; }
        public UserData Sender { get; set; }
        public Chat Chat { get; set; }
        public DateTime Send {  get; set; }
        public bool BeenRead { get; set; }
    }
}