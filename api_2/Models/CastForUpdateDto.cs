using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api_2.Models
{
    public class CastForUpdateDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        
        [MaxLength(50)]
        public string Character { get; set; }
    }
}