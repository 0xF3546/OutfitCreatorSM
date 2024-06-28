using Microsoft.EntityFrameworkCore;
using webapi.Components.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using webapi.Components.Unnamed;

namespace webapi.Components
{
    public class Database : IdentityDbContext<UserData>
    {
        public DbSet<UserData> Users { get; set; }
        public DbSet<RoleData> Roles { get; set; }
        public DbSet<Component> Components { get; set; }
        public DbSet<Outfit> Outfits { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public Database(DbContextOptions<Database> options) : base (options)
        {

        }
    }
}
