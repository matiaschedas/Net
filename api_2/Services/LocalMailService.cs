using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace api_2.Services
{

  public class LocalMailService : IMailService
  {
    private IConfiguration _config; 
    public LocalMailService(IConfiguration config){
        _config = config;
    }
    public void Send(string subject, string message)
    {
      Debug.WriteLine($"Mail enviado de {_config["mailSettings:mailToAddress"]} a {_config["mailSettings:mailFromAddress"]} utilizando LocalMailService");
      Debug.WriteLine($"Asunto: {subject}");
      Debug.WriteLine($"Mensaje: {message}");
    }
  }
}