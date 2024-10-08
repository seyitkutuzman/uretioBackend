import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { API_URL2 } from '../../constants';

@Component({
  selector: 'app-company-login',
  templateUrl: './company-login.component.html',
  styleUrls: ['./company-login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule]
})
export class CompanyLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.http.post<any>(`${API_URL2}/company/login`, { email, password }).subscribe(
        (response) => {
          // Token ve rol bilgisini localStorage'a kaydediyoruz
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);

          // Şirket panosuna yönlendiriyoruz
          this.router.navigate(['/company-dashboard']);
        },
        (error) => {
          this.errorMessage = 'Giriş bilgileri hatalı. Lütfen tekrar deneyin.';
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
