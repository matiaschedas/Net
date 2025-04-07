using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MovieApp
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddRazorPages();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //middlewares: (el orden de los mismos importan)
            //app.UseDefaultFiles(); //routea localhost:5000 al archivo por defecto que es Index.html de la carpeta wwwroot (routeo de archivos locales servidos)
            if(env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();//muestra los errores en la pagina web, solo en ambiente de dev
            }
            else
            {
                app.UseExceptionHandler("/error");
            }
            
            app.UseStaticFiles(); //permite usar archivos estaticos del direcotio wwwroot del proyecto (ejemplo: localhost:5000/Index.html)
           
            app.UseRouting();

            app.UseEndpoints(x => 
            {
                x.MapRazorPages();
                
                x.MapControllerRoute(
                    name: "Default",
                    pattern: "{controller}/{action}/{id?}",
                    defaults: new { controller = "App", action = "Index" });
            });
        }
    }
}
