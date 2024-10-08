import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL2 } from '../../constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule]
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  // Şifre gereksinimlerinin durumunu tutan nesne
  passwordRequirements = {
    minLength: false,
    upperCase: false,
    lowerCase: false,
    digit: false,
    specialChar: false
  };

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    return group.get('newPassword')?.value === group.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  checkPasswordRequirements(): void {
    const password = this.changePasswordForm.get('newPassword')?.value || '';

    this.passwordRequirements.minLength = password.length >= 8;
    this.passwordRequirements.upperCase = /[A-Z]/.test(password);
    this.passwordRequirements.lowerCase = /[a-z]/.test(password);
    this.passwordRequirements.digit = /[0-9]/.test(password);
    this.passwordRequirements.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;

      // Şifre gereksinimlerinin hepsinin karşılandığını kontrol edin
      const allRequirementsMet = Object.values(this.passwordRequirements).every(value => value === true);

      if (!allRequirementsMet) {
        this.errorMessage = 'Yeni şifre gerekli karmaşıklık koşullarını karşılamıyor.';
        return;
      }

      const token = localStorage.getItem('token'); // Adjust the key if you use a different one
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post(`${API_URL2}/auth/change-password`, { currentPassword, newPassword }, { headers })
        .subscribe(
          () => {
            this.successMessage = 'Şifreniz başarıyla değiştirildi.';
            // Optionally, redirect after a delay
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 2000);
          },
          (error) => {
            console.error('Hata oluştu:', error);

            if (error.status === 400) {
              // Servisten dönen hata mesajını al
              this.errorMessage = error.error || 'İstek hatalı.';
            } else if (error.status === 401) {
              this.errorMessage = 'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.';
              // Redirect to login page
              this.router.navigate(['/login']);
            } else {
              this.errorMessage = 'Şifre değiştirme işlemi sırasında hata oluştu. Lütfen tekrar deneyiniz.';
            }
          }
        );
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
