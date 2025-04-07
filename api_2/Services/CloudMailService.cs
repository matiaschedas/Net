using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace api_2.Services
{
    public class CloudMailService : IMailService
    {
        private IConfiguration _config; 
        public CloudMailService(IConfiguration config){
            _config = config;
        }
        public void Send(string subject, string message)
        {
            //se puede leer directo desde el config de esta forma o se puede pasar el config a un objeto o una seccion del config a un objeto
            Debug.WriteLine($"Mail enviado de {_config["mailSettings:mailToAddress"]} a {_config["mailSettings:mailFromAddress"]} utilizando CloudMailService");
            Debug.WriteLine($"Asunto: {subject}");
            Debug.WriteLine($"Mensaje: {message}");
        }
    }
}