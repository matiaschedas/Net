using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api_2.Entities
{
    public class Cast
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [Required]
        [MaxLength(50)]
        public string Character { get; set; }

        //con esto tendremos una relacion con la tabla Movie (FK)
        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }
        public int MovieId { get; set; }
        
        public int? Age { get; set; }
    }
}