using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace uretioBackend.Models
{
    public class Basvuru
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public int BirthYear { get; set; }
        public string Gender { get; set; }
        public string Profession { get; set; }
        public string ContentAreas { get; set; }
        public string? ProfilFotoYolu { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string ShippingAddress { get; set; }
        public string RelationshipStatus { get; set; }
        public string HasChildren { get; set; }
        public string HasPets { get; set; }
        public string YouTubeProfile { get; set; }
        public string InstagramProfile { get; set; }
        public string TikTokProfile { get; set; }
        public string VideoLink1 { get; set; }
        public string VideoLink2 { get; set; }
        public string VideoLink3 { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
