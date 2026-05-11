using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models
{
    public class User
    {
        public int Id { get; set; }

        [Column("Name")]
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User";
    }
}
