import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      this.router.navigate(['/admin-login']);
      return of(false);
    }

    return this.http.get<any>('http://localhost:5000/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(res => {
        if (res.isAdmin) return true;
        this.router.navigate(['/admin-login']);
        return false;
      }),
      catchError(() => {
        localStorage.clear();
        this.router.navigate(['/admin-login']);
        return of(false);
      })
    );
  }
}