using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_2.Context;
using api_2.Services;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace api
{
    public class Startup
    {
        private IConfiguration _configuration;
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(action => {
                action.ReturnHttpNotAcceptable = true; //esto devuelve un error 406 de formato no aceptado (para cuando el front requiere un formato en el accept que no esta contemplado en nuestra api)
                
           })
           .AddXmlDataContractSerializerFormatters()  //esto agrega el formato xml como formato posible de nuestra api
           .AddNewtonsoftJson();
            /*formas de agregar un servicio:
                services.AddTransient -> crea una nueva instancia del servicio cada vez que es utilizado en un controller
                services.AddScoped -> reutiliza la misma instancia de un servicio en todos los controllers si es del mismo http request 
                services.Singleton -> reutiliza siempre la misma instancia en todos los controllers aunque sean en distintos http request
            */
            //para los servicios se crea una interface y se registra con la misma, de esta manera en el controlador inyecto la dependencia con la interfaz y ya segun que servicio registro aca es el que se usara
            //y como todos deben implementar la interfaz son intercambiables a lo largo de toda la solucion 
           services.AddTransient<IMailService, CloudMailService>();
           //no se debe tener info sensible como el el conection string en el codigo:
           string connectionString = _configuration["connectionStrings:movieInfoDbConnectionString"];
           services.AddDbContext<MovieInfoContext>(o => 
           {
                o.UseSqlite(connectionString);
           }); //se agregara con el tiempo de vida Scoped
           services.AddScoped<IMovieInfoRepository, MovieInfoRepository>();
           services.AddAutoMapper(typeof(Startup));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
              endpoints.MapControllers();
            });
        }
    }
}
