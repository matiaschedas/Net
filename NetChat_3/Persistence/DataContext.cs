using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Channel> Channels { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<Channel>()
                .HasData(new Channel{
                        Id = Guid.NewGuid(),
                        Name = "DotnetCore",
                        Description = "Canal dedicado a dotnet core"
                    },
                    new Channel{
                        Id = Guid.NewGuid(),
                        Name = "Angular",
                        Description = "Canal dedicado a Angular"
                    },
                    new Channel{
                        Id = Guid.NewGuid(),
                        Name = "Reactjs",
                        Description = "Canal dedicado a Reactjs"
                    }
                );
        }
    }
}
