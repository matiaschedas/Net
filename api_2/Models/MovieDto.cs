using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_2.Models
{
    public class MovieDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<CastDto> Casts{ get; set; } = new List<CastDto>();
    }
}