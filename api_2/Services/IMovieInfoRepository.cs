using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_2.Entities;

namespace api_2.Services
{
    public interface IMovieInfoRepository
    {
        IEnumerable<Movie> GetMovies();

        Movie GetMovie(int movieId, bool includeCast);

        IEnumerable<Cast> GetCastsByMovie(int movieId);

        Cast GetCastByMovie(int movieId, int castId);

        bool MovieExist(int movieId);

        void AddCastForMovie(int movieId, Cast cast);
        void UpdateCastForMovie(int movieId, Cast cast);
        void DeleteCast(Cast cast);
        bool Save();

    }
}