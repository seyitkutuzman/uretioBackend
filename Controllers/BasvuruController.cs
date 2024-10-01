using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;
using System;
using uretioBackend.Data;
using uretioBackend.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Net;
using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;

namespace uretioBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasvurularController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BasvurularController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Basvurular
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Basvuru>>> GetBasvurular()
        {
            return await _context.Basvuru.ToListAsync();
        }

        // GET: api/Basvurular/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Basvuru>> GetBasvuru(int id)
        {
            var basvuru = await _context.Basvuru.FindAsync(id);

            if (basvuru == null)
            {
                return NotFound();
            }

            return basvuru;
        }

        // POST: api/Basvurular
        [HttpPost]
        public async Task<IActionResult> PostBasvuru([FromForm] Basvuru basvuru, IFormFile profilFoto)
        {
            if (basvuru == null)
            {
                return BadRequest("Başvuru verileri eksik.");
            }

            if (profilFoto != null)
            {
                // Profil fotoğrafını kaydetme işlemleri
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{profilFoto.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profilFoto.CopyToAsync(stream);
                }

                // Profil fotoğrafının dosya yolunu kaydediyoruz
                basvuru.ProfilFotoYolu = uniqueFileName;
            }
            else
            {
                return BadRequest("Profil fotoğrafı yüklemek zorunludur.");
            }

            try
            {
                _context.Basvuru.Add(basvuru);
                await _context.SaveChangesAsync();

                // Başvuru kaydedildikten sonra mail gönder
                await SendEmail(basvuru);

                return CreatedAtAction(nameof(GetBasvuru), new { id = basvuru.Id }, basvuru);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Sunucu hatası: " + ex.InnerException?.Message);
            }
        }

        // Mail gönderme fonksiyonu MailKit kullanarak güncellendi
        // Mail gönderme fonksiyonu MailKit kullanarak güncellendi
private async Task SendEmail(Basvuru basvuru)
{
    try
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Uretio", "hello@uretio.com"));
        message.To.Add(new MailboxAddress("", "seyit1903247@gmail.com"));
        message.Subject = "Yeni Başvuru Alındı";

        // E-posta içeriğini oluşturuyoruz
        var bodyBuilder = new BodyBuilder
        {
            TextBody = $"Merhaba, {basvuru.FullName} kişisinden yeni bir başvuru alındı.\n\n" +
                       $"Doğum Yılı: {basvuru.BirthYear}\n" +
                       $"Cinsiyet: {basvuru.Gender}\n" +
                       $"Meslek: {basvuru.Profession}\n" +
                       $"İçerik Ürettiği Alanlar: {basvuru.ContentAreas}\n\n" +
                       $"Telefon: {basvuru.Phone}\n" +
                       $"E-Mail: {basvuru.mail}\n" +
                       $"Şehir: {basvuru.City}\n" +
                       $"Kargo Adresi: {basvuru.ShippingAddress}\n\n" +
                       $"İlişki Durumu: {basvuru.RelationshipStatus}\n" +
                       $"Çocuk Durumu: {basvuru.HasChildren}\n" +
                       $"Evcil Hayvan Durumu: {basvuru.HasPets}\n\n" +
                       $"Instagram Profili: {basvuru.InstagramProfile}\n" +
                       $"YouTube Profili: {basvuru.YouTubeProfile}\n" +
                       $"TikTok Profili: {basvuru.TikTokProfile}\n\n" +
                       $"Video 1: {basvuru.VideoLink1}\n" +
                       $"Video 2: {basvuru.VideoLink2}\n" +
                       $"Video 3: {basvuru.VideoLink3}"
        };

        // Profil fotoğrafını e-postaya ekliyoruz
        if (!string.IsNullOrEmpty(basvuru.ProfilFotoYolu))
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", basvuru.ProfilFotoYolu);
            if (System.IO.File.Exists(filePath))
            {
                bodyBuilder.Attachments.Add(filePath);
            }
        }

        // E-posta gövdesini ayarla
        message.Body = bodyBuilder.ToMessageBody();

        // SMTP ayarlarını kullanarak mail gönder
        using (var client = new SmtpClient())
        {
            await client.ConnectAsync("smtpout.secureserver.net", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync("hello@uretio.com", "Pea3-%-rF8hZNZ62");

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
    catch (Exception ex)
    {
        // Hata durumunda loglama işlemi yapabilirsiniz
        Console.WriteLine($"E-posta gönderim hatası: {ex.Message}");
    }
}


        // PUT: api/Basvurular/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBasvuru(int id, [FromForm] Basvuru basvuru, IFormFile profilFoto)
        {
            if (id != basvuru.Id)
            {
                return BadRequest("ID uyuşmazlığı.");
            }

            if (profilFoto != null)
            {
                // Mevcut profil fotoğrafını silme
                var existingBasvuru = await _context.Basvuru.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
                if (existingBasvuru != null && !string.IsNullOrEmpty(existingBasvuru.ProfilFotoYolu))
                {
                    var existingFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", existingBasvuru.ProfilFotoYolu);
                    if (System.IO.File.Exists(existingFilePath))
                    {
                        System.IO.File.Delete(existingFilePath);
                    }
                }

                // Yeni profil fotoğrafını kaydetme
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{profilFoto.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profilFoto.CopyToAsync(stream);
                }

                // Profil fotoğrafının dosya yolunu güncelleme
                basvuru.ProfilFotoYolu = uniqueFileName;
            }
            else
            {
                // Profil fotoğrafı güncellenmediyse mevcut yolu koru
                var existingBasvuru = await _context.Basvuru.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
                if (existingBasvuru != null)
                {
                    basvuru.ProfilFotoYolu = existingBasvuru.ProfilFotoYolu;
                }
            }

            _context.Entry(basvuru).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(basvuru);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BasvuruExists(id))
                {
                    return NotFound("Başvuru bulunamadı.");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Sunucu hatası: " + ex.Message);
            }
        }

        // DELETE: api/Basvurular/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBasvuru(int id)
        {
            var basvuru = await _context.Basvuru.FindAsync(id);
            if (basvuru == null)
            {
                return NotFound("Başvuru bulunamadı.");
            }

            // Profil fotoğrafını silme
            if (!string.IsNullOrEmpty(basvuru.ProfilFotoYolu))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", basvuru.ProfilFotoYolu);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.Basvuru.Remove(basvuru);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Başvuru başarıyla silindi." });
        }

        // Başvurunun var olup olmadığını kontrol eden yardımcı metod
        private bool BasvuruExists(int id)
        {
            return _context.Basvuru.Any(e => e.Id == id);
        }
    }
}
