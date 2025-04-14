using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using api_2.Entities;
using api_2.Models;
using api_2.Services;
using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IIS.Core;
using Microsoft.Extensions.Logging;

namespace api_2.Controllers
{
    
    [ApiController]
    [Route("api/movies/{movieId}/casts")]
    public class CastController : ControllerBase
    {
        private ILogger<CastController> _logger;
        private IMailService _localMailService;
        private IMovieInfoRepository _repository;
        private IMapper _mapper;

    //inyeccion de dependecias :
    public CastController(ILogger<CastController> logger, IMailService localMailService, IMovieInfoRepository repository, IMapper mapper)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger)); 
            _localMailService = localMailService ?? throw new ArgumentNullException(nameof(localMailService));
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet]
        public IActionResult GetCasts(int movieId)
        {
            bool movieExist = _repository.MovieExist(movieId);
            if (!movieExist) return NotFound();
            var casts = _repository.GetCastsByMovie(movieId);
          
            return Ok(_mapper.Map<IEnumerable<CastDto>>(casts));
        }

        [HttpGet("{id}", Name = "GetCast")]
        public IActionResult GetCast(int movieId, int id)
        {
            try{
                //throw new InvalidOperationException(); //<-- para probar el logger
                bool movieExist = _repository.MovieExist(movieId);
                if (!movieExist) return NotFound();
                var cast = _repository.GetCastByMovie(movieId, id);
                if (cast == null) return NotFound();
                CastDto nuevo = _mapper.Map<CastDto>(cast);
                return Ok(_mapper.Map<CastDto>(cast));
            }
            catch (Exception ex)
            {
                _logger.LogCritical($"Ocurrio un error al buscar el cast con id {id} ", ex.Message);
                return StatusCode(500, "Un problema ocurrio al realizar la solicitud al recurso");
            }
        }

        [HttpPost]
        //el [FromBody] lo que hace es deserealizar el contenido del body que se envia en la solicitud hacia cast
        //si el cliente envia en el body algo que no se logra deserealizar en este endpoint (CastForCreationDto) entonces cast quedara en null y automaticamente respondera con un BadRequest() (no hace falta agregarlo a mano)
        public IActionResult CreateCast(int movieId, [FromBody] CastForCreationDto cast)
        {
            //ejemplo de validacion: (es un ejemplo, realmente no es el controlador el que deberia manejar esta logica de negocio, se podria usar fluent validation por ejemplo)
            if(cast.Name == cast.Character)
            {
                ModelState.AddModelError(
                    "Name",
                    "El nombre debe ser distinto al personaje"
                );
                return BadRequest(ModelState);
            }
            bool movieExist = _repository.MovieExist(movieId);
            if (!movieExist) return NotFound();

            var finalCast = _mapper.Map<Cast>(cast);
            _repository.AddCastForMovie(movieId, finalCast);
            _repository.Save();
            var createdCastToReturn = _mapper.Map<CastForCreationDto>(finalCast);

            return CreatedAtRoute(
            nameof(GetCast),
            new{ movieId = movieId, id = finalCast.Id },
            createdCastToReturn); //aca se agrega por lo general el recurso recien creado para pasarselo al cliente
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCast(int movieId, int id, [FromBody] CastForUpdateDto castForUpdate)
        {
            bool movieExist = _repository.MovieExist(movieId);
            if (!movieExist) return NotFound();
            var castFromStore = _repository.GetCastByMovie(movieId,id);
            if (castFromStore==null) return NotFound();
            _mapper.Map(castForUpdate, castFromStore);
            _repository.UpdateCastForMovie(movieId, castFromStore);
            _repository.Save();
            return NoContent();
        }

        //cuando se hace una actualizacion parcial se utiliza Patch, y el estandar para enviar a traves del body es:
        /*ejemplo de body de la peticion para reemplazar solo el nombre:
        [
            {
                "op": "replace",
                "path": "/name",
                "value": "Rodrigo"
            }
        ]
        */
        [HttpPatch("{id}")]
        public IActionResult PartialUpdateCast(int movieId, int id, [FromBody] 
        JsonPatchDocument<CastForUpdateDto> patchDocument)
        {
            bool movieExist = _repository.MovieExist(movieId);
            if (!movieExist) return NotFound();
            var castFromStore = _repository.GetCastByMovie(movieId,id);
            if (castFromStore==null) return NotFound();
            var castToPatch = _mapper.Map<CastForUpdateDto>(castFromStore);
            //con esta linea se aplica lo que nos llega desde el cliente en patchDocuemnt aplicarlo al elemento de la base de datos (en este caso castToPatch):
            patchDocument.ApplyTo(castToPatch, ModelState); //se le pasa el ModelState porque si el usuario se equivovo en alguno de los campos, de esta forma se valida, (para poder pasarle el modelstate en net 5 hay que instalar Newtonsoft.Json al proyecto y agregarlo como servicio en startup.cs, en futuras versiones de net deberia no ser necesario)
            if(!ModelState.IsValid) return BadRequest(ModelState);
            if(!TryValidateModel(castToPatch)) return BadRequest(ModelState); //esto valida que el castToPatch sea valido luego de los cambios (valido con respecto a los decorators del model)
            //una vez aplicados los cambios en el castToPatch se debe aplicar esos cambios al de la base de datos:
            _mapper.Map(castToPatch, castFromStore);
            _repository.UpdateCastForMovie(movieId, castFromStore);
            _repository.Save();
            
            return NoContent();
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteCast(int movieId, int id)
        {
            bool movieExist = _repository.MovieExist(movieId);
            if (!movieExist) return NotFound();
            var castFromStore = _repository.GetCastByMovie(movieId, id);
            if (castFromStore==null) return NotFound();
            _repository.DeleteCast(castFromStore);
            _repository.Save();
            _localMailService.Send("Recurso eliminado", $"El recurso con id {id} fue eliminado");
            return NoContent();
        }
    }
}