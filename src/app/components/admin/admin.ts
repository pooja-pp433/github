import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  loginAdmin() {
    if (!this.email || !this.password) {
      this.error = 'Please fill all fields!';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post<any>('http://localhost:5000/api/admin/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;

        // ✅ Token aur admin info save karo
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('admin', JSON.stringify(res.admin));

        // ✅ Dashboard pe bhejo
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid credentials!';
      }
    });
  }
}