import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { MyBookings } from './components/my-bookings/my-bookings';

import { BookTicket } from './components/book-ticket/book-ticket';
import { BusList } from './components/bus-list/bus-list';
import { Search } from './components/search/search';
import { Admin } from './components/admin/admin';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard';
import { LiveTracking } from './components/live-tracking/live-tracking';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'search', component: Search },
  { path: 'bus-list', component: BusList },
  { path: 'book-ticket', component: BookTicket },
  { path: 'live-tracking', component: LiveTracking }, 
  { path: 'my-bookings', component: MyBookings },
  { path: 'admin', component: Admin },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
];

// app.routes.ts
