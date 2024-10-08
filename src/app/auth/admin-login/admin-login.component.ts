import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_URL2 } from '../../constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule, CommonModule]
})
export class AdminLoginComponent {
  adminLoginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.adminLoginForm.valid) {
      const { email, password } = this.adminLoginForm.value;
      this.http.post<any>(`${API_URL2}/auth/admin-login`, { email, password }).subscribe(
        (response) => {
          localStorage.setItem('adminToken', response.token);
          this.router.navigate(['/admin-dashboard']);
        },
        (error) => {
          this.errorMessage = 'Giriş bilgileri hatalı. Lütfen tekrar deneyin.';
        }
      );
    }
  }
}
