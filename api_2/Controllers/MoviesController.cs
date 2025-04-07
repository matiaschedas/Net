using System;
using System.Collections.Generic;
using System.Linq;
using api_2;
using api_2.Models;
using api_2.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [ApiController]
  [Route("api/movies")]
  public class MoviesController : ControllerBase
  {
    private IMovieInfoRepository _repository;
    private IMapper _mapper;

    public MoviesController(IMovieInfoRepository repository, IMapper mapper)
    {
      _repository = repository ?? throw new ArgumentNullException(nameof(repository));
      _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }
    public IActionResult GetMovies()
    {
      //MoviesDataStore.Current.Movies
      var movies = _repository.GetMovies();
    
      return Ok(_mapper.Map<IEnumerable<MovieDto>>(movies));
    }
   //cuando incluyo un parametro que no esta enrutado se puede usar de esta forma: http://localhost:5000/api/movies/1?includeCast=false
    [HttpGet("{id}")]
    public IActionResult GetMovie(int id, bool includeCast){
      var movie = _repository.GetMovie(id, includeCast);
      if(movie == null) return NotFound();
      
      if(!includeCast) return Ok(_mapper.Map<MovieWithOutCastDto>(movie));

      return Ok(_mapper.Map<MovieDto>(movie));
    }
  }
}

