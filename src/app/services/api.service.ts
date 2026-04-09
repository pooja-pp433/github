import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private base = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.base}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.base}/auth/login`, data);
  }

  searchBuses(from: string, to: string, date: string): Observable<any> {
    return this.http.get(`${this.base}/buses?from=${from}&to=${to}`);
  }

  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.base}/bookings`, data);
  }

  getMyBookings(userId: string): Observable<any> {
    return this.http.get(`${this.base}/bookings/${userId}`);
  }
}