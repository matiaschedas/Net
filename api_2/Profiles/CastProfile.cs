using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_2.Entities;
using api_2.Models;
using AutoMapper;

namespace api_2.Profiles
{
    public class CastProfile : Profile
    {
         public CastProfile()
        {
            CreateMap<Cast, CastDto>();
            CreateMap<CastForCreationDto, Cast>();
            CreateMap<Cast, CastForCreationDto>();
            CreateMap<CastForUpdateDto, Cast>().ReverseMap();
            //con el ReverseMap me ahorro poner el mapeo contrario: CreateMap<Cast, CastForUpdateDto>();
            
        }
    }
}