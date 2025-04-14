using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Channels
{
    public class Details
    {
        public class Query : IRequest<Channel>
        {
            public Guid Id { get; set;}
        }

        public class Handler : IRequestHandler<Query, Channel>
        {
            private DataContext _context;

            public Handler(DataContext context)
            {
                _context = context ?? throw new ArgumentNullException(nameof(context));
            }
            public async Task<Channel> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Channels.FirstOrDefaultAsync(x => x.Id == request.Id);
            }
        }
    }
}