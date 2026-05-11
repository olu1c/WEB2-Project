
using AdminService.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Data
 
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { 
        
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Trip> Trips { get; set; }
    }
}
