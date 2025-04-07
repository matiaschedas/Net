using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using api_2.Models;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace api_2
{
    public class MoviesDataStore
    {
        public static MoviesDataStore Current { get; } = new MoviesDataStore();
        public List<MovieDto> Movies { get; set; }
        public MoviesDataStore(){
            Movies = new List<MovieDto>(){
            new MovieDto(){
                Id=1,
                Name="Pandillas de nueva york",
                Description="Gangs of New York ye una película histórica del añu 2002 dir",
                Casts = new List<CastDto>(){
                    new CastDto{ Id = 1, Name = "Daniel Day-Lewis", Character="alguien"},
                    new CastDto{ Id = 2, Name="Leonardo DiCaprio", Character="jorge"},
                    new CastDto{ Id = 3, Name="Liam Neeson", Character="Priest"},
                }
            },
            new MovieDto(){
                Id=2,
                Name="Forrest Gump",
                Description = "Es un chico que sufre cierto retraso mental. A pesar de ",
                Casts = new List<CastDto>(){
                    new CastDto{ Id = 1, Name = "Tom Hanks", Character="Forrest Gump"},
                    new CastDto{ Id = 2, Name="Gary Sinise", Character="Teniente"},
                    new CastDto{ Id = 3, Name="Robin Wright", Character="Jenny"},
                }
            },
            new MovieDto(){
                Id=3,
                Name="Taxi Driver",
                Description="mbientada en la Nueva York de la década de 1970, poco después",
                Casts = new List<CastDto>(){
                    new CastDto{ Id = 1, Name = "Robert De Niro", Character="Travis"},
                    new CastDto{ Id = 2, Name="Martin Scorsese", Character="Passe"},
                    new CastDto{ Id = 3, Name="Jodie Foster", Character="Iris"},
                }
            },
         };
        }
    }
}