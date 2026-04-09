import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  isLoggedIn = false;
  userName = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();

    // Har route change par navbar update karo
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  checkLoginStatus() {
    if (typeof window === 'undefined') return; // SSR safe

    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token   = localStorage.getItem('token') || sessionStorage.getItem('token');

    try {
      if (userStr && token) {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          this.isLoggedIn = true;
          this.userName = user.name || user.email.split('@')[0];
          return;
        }
      }
    } catch (e) {}

    this.isLoggedIn = false;
    this.userName = '';
  }

  logout() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('lastFrom');
    localStorage.removeItem('lastTo');
    localStorage.removeItem('lastDate');

    this.isLoggedIn = false;
    this.userName = '';
    this.router.navigate(['/']);
  }
}