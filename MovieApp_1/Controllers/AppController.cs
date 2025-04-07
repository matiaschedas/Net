using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MovieApp.ViewModel;

namespace MovieApp.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    public class AppController : Controller
    {
        private static List<MovieViewModel> _movieList = new List<MovieViewModel>();
        public IActionResult Index()
        {
            return View(_movieList);
        }

        public IActionResult AddOrEdit(Guid id)
        {
            var movie = _movieList.FirstOrDefault(x => x.Id == id);
            return View(movie);
        }
        
        [HttpPost]
        public IActionResult AddOrEdit(MovieViewModel model)
        {
            var movie = _movieList.FirstOrDefault(x => x.Id == model.Id);
            //ModelState.IsValid me dara true si todos los campos del model son correctos de acuerdo a los decoradores del modelo, po ejemplo [Required]
            if (!ModelState.IsValid){
                //hacer lo que corresponda
                return View();
            }
            if (movie == null)
            {
                model.Id = Guid.NewGuid();
                _movieList.Add(model);
            }
            else{
                movie.Genre=model.Genre;
                movie.Name=model.Name;
            }
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Delete(Guid id)
        {
            _movieList.Remove(_movieList.FirstOrDefault(x => x.Id == id));
            return RedirectToAction(nameof(Index));
        }

        //con esto seteo el enrutamiento directo en la accion y no hay que ir al controlador y luego a esta accion:
        [HttpGet("about")]
        public IActionResult About()
        {
            return View();
        }
    }
}