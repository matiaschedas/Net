using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api_2.Context;
using Microsoft.AspNetCore.Mvc;
using SQLitePCL;

namespace api_2.Controllers
{
    [ApiController]
    [Route("api/testdatabase")]
    public class DummyController : ControllerBase
    {
        private MovieInfoContext _context;

        public DummyController(MovieInfoContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public ActionResult Testdatabase()
        {
            return Ok();
    }
    }
}