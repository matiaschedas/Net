using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_2.Entities;
using Microsoft.EntityFrameworkCore;

namespace api_2.Context
{
    public class MovieInfoContext : DbContext
    {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Cast> Casts { get; set; }
        /* una forma de hacer la coneccion a la bd:
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("connectionString");
            base.OnConfiguring(optionsBuilder);
        }*/
        //otra manera: pasando el options al constructor padre DbContext
        public MovieInfoContext(DbContextOptions<MovieInfoContext> options) : base(options)
        {
            //Database.EnsureCreated();//esto asegura que la db este creada y si no lo esta la crea, si trabajmos con migraciones no se requiere porque se crea con la primera migracion
            /* se realizara una migration de Entity framework para pasar de codigo a crear la base de datos automaticamente, ademas luego se puede hacer un update de la migration para que el esquema de la base de datos se actualice a medida que cambiamos el codigo*/
            /*.dotnet ef migrations add MovieInfoInitialMigration*/
            /*dotnet ef database update <--- con este comando se aplica la migration a la bd*/
        }
        
        //sobreescribir este metodo sirve para meter info inicial a la bd:
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Movie>()
                .HasData(
                    new Movie()
                    {
                        Id = 1,
                        Name = "Pandillas de nueva york",
                        Description = "Gangs of New York ye una película histórica del añu 2002 dirixida por Martin Scorsese"
                    },
                    new Movie()
                    {
                        Id = 2,
                        Name = "Forrest Gump",
                        Description = "Es un chico que sufre un cierto retraso mental. A pesar de todo, gracias a su tenacidad y a su buen corazón será protagonista de acontecimientos cruciales de su país"
                    },
                    new Movie()
                    {
                        Id = 3,
                        Name = "Taxi Driver",
                        Description = "Ambientada en la Nueva York de la década de 1970, poco después de que terminara la guerra de Vietnam, se centra en la vida de Travis Bickle, un excombatiente solitario e inestable que debido a su insomnio crónico comienza a trabajar como taxista,"
                    }
                );

            modelBuilder.Entity<Cast>()
              .HasData(
                new Cast()
                {
                    Id = 1,
                    Name = "Daniel Day-Lewis",
                    Character = "The Butcher",
                    MovieId = 1
                },
                new Cast()
                {
                    Id = 2,
                    Name = "Leonardo DiCaprio",
                    Character = "Amsterdam Vallon",
                    MovieId = 1
                },
                 new Cast()
                 {
                     Id = 3,
                     Name = "Liam Neeson",
                     Character = "Priest Vallon",
                     MovieId = 1
                 },
                  new Cast()
                  {
                      Id = 4,
                      Name = "Tom Hanks",
                      Character = "Forrest Gump",
                      MovieId = 2
                  },
                  new Cast()
                  {
                      Id = 5,
                      Name = "Gary Sinise",
                      Character = "Teniente Dan",
                      MovieId = 2
                  },
                  new Cast()
                  {
                      Id = 6,
                      Name = "Robin Wright",
                      Character = "Jenny curran",
                      MovieId = 2
                  },
                  new Cast()
                  {
                      Id = 7,
                      Name = "Robert De Niro",
                      Character = "Travis Bickle",
                      MovieId = 3
                  },
                  new Cast()
                  {
                      Id = 8,
                      Name = "Martin scorsese",
                      Character = "Passenger",
                      MovieId = 3
                  },
                  new Cast()
                  {
                      Id = 9,
                      Name = "Jodie Foster",
                      Character = "Iris",
                      MovieId = 3
                  }
                );

            base.OnModelCreating(modelBuilder);
        }

    }
}