using Microsoft.EntityFrameworkCore;
using Domain;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        // dbset represents one table in the db
        public DbSet<Activity> Activities { get; set; }
    }
}