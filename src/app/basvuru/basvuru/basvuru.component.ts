import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // HttpClientModule import edildi
import { API_URL, API_URL2 } from '../../constants';
import { ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-basvuru',
  templateUrl: './basvuru.component.html',
  styleUrls: ['./basvuru.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  animations: [
    trigger('stepAnimation', [
      transition(':increment', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })),
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateY(100%)', opacity: 0 }),
            animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
          ], { optional: true })
        ])
      ]),
      transition(':decrement', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateY(-100%)', opacity: 0 }),
            animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
          ], { optional: true })
        ])
      ]),
    ]),
  ],
})
export class BasvuruComponent implements OnInit {
  basvuruForm!: FormGroup;
  currentStep: number = 0;
  isSubmitting: boolean = false; // Başvuru gönderim durumu
  selectedImage: string | ArrayBuffer | null = null;
  profilFotoError: boolean = false;
  profilFotoErrorMessage: string = '';

  submittedData: any = null;
  allCheckboxesChecked: boolean = false;
  popupData: any = null;

  @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;

  constructor(private fb: FormBuilder, private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.basvuruForm = this.fb.group({
      kisiselBilgiler: this.fb.group({
        adSoyad: ['', Validators.required],
        dogumYili: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
        cinsiyet: ['', Validators.required],
        meslek: ['', Validators.required],
        icerikUrettiginAlanlar: ['', Validators.required],
        profilFoto: [null],
      }),
      iletisimBilgileri: this.fb.group({
        telefon: ['', [Validators.required, Validators.pattern(/^5[0-9]{9}$/)]],
        mail: ['', [Validators.required, Validators.email]],
        sehir: ['', Validators.required], 
        kargoAdresi: ['', Validators.required],
      }),
      aileDurumu: this.fb.group({
        iliskiDurumu: ['', Validators.required],
        cocukDurumu: ['', Validators.required],
        evcilHayvanDurumu: ['', Validators.required],
      }),
      portfolyo: this.fb.group({
        youtubeProfil: [''],
        instagramProfil: ['', Validators.required],
        tiktokProfil: [''],
        cekilenVideo1: ['', Validators.required],
        cekilenVideo2: [''],
        cekilenVideo3: [''],
      }),
      acikRiza: [false, Validators.requiredTrue],
      aydinlatmaMetni: [false, Validators.requiredTrue],
      gizlilikSozlesmesi: [false, Validators.requiredTrue],
    });

    this.basvuruForm.valueChanges.subscribe(() => {
      this.allCheckboxesChecked = this.basvuruForm.get('acikRiza')?.value &&
                                  this.basvuruForm.get('aydinlatmaMetni')?.value &&
                                  this.basvuruForm.get('gizlilikSozlesmesi')?.value;
    });    
  }


  openPopup(metin: 'acikRizaMetni' | 'aydinlatmaMetni' | 'gizlilikSozlesmesi') {
    let filePath = '';

    switch (metin) {
      case 'acikRizaMetni':
        filePath = 'assets/uretio-acik-riza-metni.txt';
        break;
      case 'aydinlatmaMetni':
        filePath = 'assets/uretio-aydinlatma-metni.txt';
        break;
      case 'gizlilikSozlesmesi':
        filePath = 'assets/uretio-gizlilik-sozlesmesi.txt';
        break;
    }

    // Fetch the text file
    this.http.get(filePath, { responseType: 'text' }).subscribe((content) => {
      this.popupData = {
        title: this.getPopupTitle(metin),
        content: content
      };
      this.modalService.open(this.popupTemplate);
    });
  }

  getPopupTitle(metin: string): string {
    switch (metin) {
      case 'acikRizaMetni':
        return 'Açık Rıza Metni';
      case 'aydinlatmaMetni':
        return 'Aydınlatma Metni';
      case 'gizlilikSozlesmesi':
        return 'Gizlilik Sözleşmesi';
      default:
        return '';
    }
  }

  closePopup() {
    this.modalService.dismissAll();
  }

  get kisiselForm(): FormGroup {
    return this.basvuruForm.get('kisiselBilgiler') as FormGroup;
  }

  get iletisimForm(): FormGroup {
    return this.basvuruForm.get('iletisimBilgileri') as FormGroup;
  }

  get aileForm(): FormGroup {
    return this.basvuruForm.get('aileDurumu') as FormGroup;
  }

  get portfolyoForm(): FormGroup {
    return this.basvuruForm.get('portfolyo') as FormGroup;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      // Dosya tipini kontrol edelim (sadece resim dosyaları)
      if (!file.type.startsWith('image/')) {
        this.profilFotoError = true;
        this.profilFotoErrorMessage = 'Lütfen geçerli bir resim dosyası yükleyin.';
        this.kisiselForm.patchValue({
          profilFoto: null
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if (width >= 400 && height >= 400) {
          // Resim boyutları uygun
          this.kisiselForm.patchValue({
            profilFoto: file
          });
          this.kisiselForm.get('profilFoto')?.updateValueAndValidity();

          // Önizleme için dosyayı okuyalım
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedImage = reader.result;
          };
          reader.readAsDataURL(file);

          // Hata durumunu sıfırla
          this.profilFotoError = false;
          this.profilFotoErrorMessage = '';
        } else {
          // Resim boyutları küçük
          this.profilFotoError = true;
          this.profilFotoErrorMessage = 'Resim boyutları en az 400x400 piksel olmalıdır.';
          this.kisiselForm.patchValue({
            profilFoto: null
          });
          this.selectedImage = null;
        }
      };
      // Resmi yüklemek için URL oluşturuyoruz
      img.src = URL.createObjectURL(file);
    } else {
      // Dosya seçilmediyse hata durumunu true yap
      this.profilFotoError = true;
      this.profilFotoErrorMessage = 'Profil fotoğrafı yüklemek zorunludur.';
      this.kisiselForm.patchValue({
        profilFoto: null
      });
      this.selectedImage = null;
    }
  }

  nextStep() {
    const steps = ['kisiselBilgiler', 'iletisimBilgileri', 'aileDurumu', 'portfolyo'];
  
    if (this.currentStep < steps.length) {
      const currentFormGroup = this.basvuruForm.get(steps[this.currentStep]) as FormGroup;
  
      if (currentFormGroup.valid) {
        this.currentStep++;
      } else {
        currentFormGroup.markAllAsTouched();
      }
    }
  }
  

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.basvuruForm.valid) {
      this.isSubmitting = true; // Başvuru sürecinde olduğunu belirtir
      const formData = new FormData();
  
      // Kişisel Bilgiler
      formData.append('FullName', this.kisiselForm.get('adSoyad')?.value);
      formData.append('BirthYear', this.kisiselForm.get('dogumYili')?.value);
      formData.append('Gender', this.kisiselForm.get('cinsiyet')?.value);
      formData.append('Profession', this.kisiselForm.get('meslek')?.value);
      formData.append('ContentAreas', this.kisiselForm.get('icerikUrettiginAlanlar')?.value);
  
      // Profil Fotoğrafı
      formData.append('ProfilFotoYolu', this.kisiselForm.get('profilFoto')?.value);
      const profilFoto = this.kisiselForm.get('profilFoto')?.value;
      if (profilFoto) {
          formData.append('profilFoto', profilFoto);
      }
  
      // İletişim Bilgileri
      formData.append('Phone', this.iletisimForm.get('telefon')?.value);
      formData.append('mail', this.iletisimForm.get('mail')?.value);
      formData.append('City', this.iletisimForm.get('sehir')?.value);
      formData.append('ShippingAddress', this.iletisimForm.get('kargoAdresi')?.value);
  
      // Aile Durumu
      formData.append('RelationshipStatus', this.aileForm.get('iliskiDurumu')?.value);  
      formData.append('HasChildren', this.aileForm.get('cocukDurumu')?.value);
      formData.append('HasPets', this.aileForm.get('evcilHayvanDurumu')?.value);
  
      // Portfolyo
      formData.append('YouTubeProfile', this.portfolyoForm.get('youtubeProfil')?.value || 'yok');
      formData.append('InstagramProfile', this.portfolyoForm.get('instagramProfil')?.value);
      formData.append('TikTokProfile', this.portfolyoForm.get('tiktokProfil')?.value|| 'yok');
      formData.append('VideoLink1', this.portfolyoForm.get('cekilenVideo1')?.value);
      formData.append('VideoLink2', this.portfolyoForm.get('cekilenVideo2')?.value|| 'yok');
      formData.append('VideoLink3', this.portfolyoForm.get('cekilenVideo3')?.value|| 'yok');
  
      // API isteği
      this.http.post(`${API_URL}/Basvurular/basvuru`, formData).subscribe(
        (response) => {
          this.submittedData = this.basvuruForm.value;
          this.submittedData.kisiselBilgiler.profilFoto = this.selectedImage;
          this.currentStep = 5;
          this.isSubmitting = false; // Başvuru tamamlandı
        },
        (error) => {
          this.isSubmitting = false; // Hata durumunda tekrar gönderime izin ver
        }
      );  
    } else {
      this.basvuruForm.markAllAsTouched();
    }
  }
  

  isCurrentStepValid(): boolean {
    const steps = ['kisiselBilgiler', 'iletisimBilgileri', 'aileDurumu', 'portfolyo'];
    const currentFormGroup = this.basvuruForm.get(steps[this.currentStep]) as FormGroup;
    return currentFormGroup.valid;
  }
}
