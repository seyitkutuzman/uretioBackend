using uretioBackend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Servisleri ekleyin
builder.Services.AddControllers();

// Veritabanı bağlantısı
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS ayarları
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // Tüm kaynaklara izin verir (Dilerseniz belli bir kaynağı belirleyebilirsiniz)
              .AllowAnyMethod()   // Tüm HTTP metodlarına (GET, POST, PUT, DELETE vs.) izin verir
              .AllowAnyHeader();  // Tüm başlıklara izin verir
    });
});

var app = builder.Build();

// CORS'u uygulamak için ekleyin
app.UseCors("AllowAll");

// Orta katmanları ekleyin
app.UseAuthorization();

app.MapControllers();

app.Run();
