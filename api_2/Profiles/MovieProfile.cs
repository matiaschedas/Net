using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_2.Entities;
using api_2.Models;
using AutoMapper;

namespace api_2.Profiles
{
    public class MovieProfile : Profile
    {
        public MovieProfile()
        {
            CreateMap<Movie, MovieDto>();
            CreateMap<Movie, MovieWithOutCastDto>();
        }
    }
}