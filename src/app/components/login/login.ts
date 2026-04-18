import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.form.email || !this.form.password) {
      this.error = 'Please fill all fields!';
      return;
    }
    this.loading = true;
    this.error = '';

    // Step 1 — Check karo user exist karta hai ya nahi
    this.http.post<any>('https://github-1-gezb.onrender.com', {
      email: this.form.email
    }).subscribe({
      next: (res) => {

        if (!res.exists) {
          this.loading = false;
          alert('You are new here! Please register first.');
          this.router.navigate(['/register']);
          return;
        }

        // Step 2 — Login karo
        this.http.post<any>('https://github-1-gezb.onrender.com', this.form).subscribe({
          next: (loginRes) => {
            // ✅ User aur token save karo
            localStorage.setItem('token', loginRes.token);
            localStorage.setItem('user', JSON.stringify(loginRes.user));
            sessionStorage.setItem('token', loginRes.token);
            sessionStorage.setItem('user', JSON.stringify(loginRes.user));
            this.loading = false;

            // ✅ Saved search check karo
            const lastFrom = localStorage.getItem('lastFrom');
            const lastTo   = localStorage.getItem('lastTo');
            const lastDate = localStorage.getItem('lastDate');

            if (lastFrom && lastTo && lastDate) {
              // ✅ Search thi — seedha bus-list pe bhejo
              // NOTE: Remove mat karo — home.ts mein form pre-fill ke liye kaam aayegi
              this.router.navigate(['/bus-list'], {
                queryParams: { from: lastFrom, to: lastTo, date: lastDate }
              });
            } else {
              // Koi search nahi thi — home pe bhejo
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error?.message || 'Wrong password!';
          }
        });
      },
      error: () => {
        this.loading = false;
        this.error = 'Server error! Please try again.';
      }
    });
  }
}
