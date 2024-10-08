import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_URL, API_URL2 } from '../../constants';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule, RouterOutlet, RouterModule]
})
export class LoginComponent {
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
      this.http.post<any>(`${API_URL2}/auth/login`, { email, password }).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);

          // Rol bilgisini localStorage'a kaydediyoruz
          localStorage.setItem('userRole', response.role);

          if (response.isFirstLogin) {
            this.router.navigate(['/password-change']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          this.errorMessage = 'Giriş bilgileri hatalı. Lütfen tekrar deneyin.';
        }
      );
    }
  }
}
