using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using uretioBackend.Models;
using Microsoft.EntityFrameworkCore;


namespace uretioBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Basvuru> Basvuru { get; set; }
    }
}