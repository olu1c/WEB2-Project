using Microsoft.EntityFrameworkCore;
using TripService.Models;

namespace TripService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Trip> Trips { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<ChecklistItem> ChecklistItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Destinations)
                .WithOne(d => d.Trip)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Activities)
                .WithOne(a => a.Trip)
                .HasForeignKey(a => a.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Trip>()
                .HasMany(t => t.Expenses)
                .WithOne(e => e.Trip)
                .HasForeignKey(e => e.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Trip>()
                .HasMany(t => t.ChecklistItems)
                .WithOne(c => c.Trip)
                .HasForeignKey(c => c.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Activity>()
                .Property(a => a.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Expense>()
                .Property(e => e.Category)
                .HasConversion<string>();
        }
    }
}
