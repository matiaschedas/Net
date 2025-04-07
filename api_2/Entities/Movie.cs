using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using api_2.Models;

namespace api_2.Entities
{
    public class Movie
    {
        [Key] //con esto entity framework reconoce que esta en la PK igualmente si la variable se llama Id no es necesario
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]//con esto le decimos a entity framework que este campo es autoincremental
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [Required]
        [MaxLength(400)]
        public string Description { get; set; }
        //teniendo este campo ya estamos indicando que habra una relacion con la tabla cast:
        public ICollection<Cast> Casts{ get; set; } = new List<Cast>();
    }
}