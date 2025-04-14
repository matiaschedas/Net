using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;
using SQLitePCL;
using Domain;

namespace Application.Channels
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }   
        }

    public class Handler : IRequestHandler<Command>
    {
        private DataContext _context;

        public Handler(DataContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
           var channel = new Channel{
                Id = request.Id,
                Name = request.Name,
                Description = request.Description
           };
           _context.Channels.Add(channel);

           var success = await _context.SaveChangesAsync() > 0;
           if(success) return Unit.Value;
           throw new Exception("Ocurrio un problema al guardar los datos");
        }
    }
  }
}