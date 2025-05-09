using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Application.User;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Login(Login.Query query)
        {   
            return await Mediator.Send(query);
        } 

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Register (Register.Command command)
        {
            return await Mediator.Send(command);
        }
        
        [HttpGet]
        public async Task<ActionResult<UserDto>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }
        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<UserDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }
        [HttpGet("logout/{id}")]
         public async Task<Unit> Logout(string id)
        {   
            return await Mediator.Send(new Logout.Query{ UserId = id });
        } 
    }
}