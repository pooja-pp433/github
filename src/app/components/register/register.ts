import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  form = { name: '', email: '', phone: '', password: '', confirmPassword: '' };
  loading = false;
  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (!this.form.name || !this.form.email || !this.form.phone || !this.form.password) {
      this.error = 'Please fill all fields!';
      return;
    }
    if (this.form.password !== this.form.confirmPassword) {
      this.error = 'Passwords do not match!';
      return;
    }

    this.loading = true;
    this.error = '';

    // ✅ MongoDB mein save karo
    this.http.post<any>('http://localhost:5000/api/auth/register', {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      password: this.form.password
    }).subscribe({
      next: () => {
        // ✅ Register success → Login pe bhejo
        this.success = '✅ Account created! Please login now.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || '';
        if (msg.toLowerCase().includes('already registered')) {
          this.error = '⚠️ Email already registered! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.error = msg || 'Registration failed!';
        }
      }
    });
  }
}