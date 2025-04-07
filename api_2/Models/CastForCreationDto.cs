using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_2.Models
{
    //creamos un modelo que si bien es igual a CastDto, este se usara para creacion (POST) y es una buena practica tenerlo separado del modelo que se usa para request GET
    public class CastForCreationDto
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [Required]
        [MaxLength(50)]
        public string Character { get; set; }
    }
}