using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Models
{
    public class User
    {
        public int Id { get; set; }
        [Column("Name")]
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
    }
}
