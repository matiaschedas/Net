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
using FluentValidation;

namespace Application.Channels
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }   
            public ChannelType ChannelType {get; set;} = ChannelType.Channel;
        }

       
        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
            }
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
                        Description = request.Description,
                        ChannelType = request.ChannelType
                };
                _context.Channels.Add(channel);

                var success = await _context.SaveChangesAsync() > 0;
                if(success) return Unit.Value;
                throw new Exception("Ocurrio un problema al guardar los datos");
            }
        }
  }
}