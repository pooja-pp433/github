import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  currentSection = 'buses';
  buses: any[] = [];
  loading = false;
  showForm = false;
  editMode = false;
  currentEditId = '';
  users: any[] = [];
  loadingUsers = false;
  bookings: any[] = [];           // ✅ NEW
  loadingBookings = false;        // ✅ NEW
  successMsg = '';
  errorMsg = '';

  formData = {
    busName: '', busNumber: '', from: '', to: '',
    departure: '', totalSeats: 40, price: 0
  };

  private BUS_API      = 'http://localhost:5000/api/buses';
  private USER_API     = 'http://localhost:5000/api/users';
  private BOOKING_API  = 'http://localhost:5000/api/bookings'; // ✅ NEW

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      this.router.navigate(['/admin']);
      return;
    }
    setTimeout(() => this.loadBuses(), 0);
  }

  private getAdminHeaders(): { headers: HttpHeaders } {
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('adminToken') || '') : '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  private getBusHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  private showMsg(type: 'success' | 'error', msg: string) {
    this.successMsg = type === 'success' ? msg : '';
    this.errorMsg   = type === 'error'   ? msg : '';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMsg = '';
      this.errorMsg = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  switchSection(section: string) {
    this.currentSection = section;
    this.closeForm();
    this.successMsg = '';
    this.errorMsg = '';
    this.cdr.detectChanges();
    if (section === 'buses')    setTimeout(() => this.loadBuses(), 0);
    if (section === 'users')    setTimeout(() => this.loadUsers(), 0);
    if (section === 'bookings') setTimeout(() => this.loadBookings(), 0); // ✅
  }

  // ══════════════════════════════════════
  // BUSES CRUD
  // ══════════════════════════════════════

  loadBuses() {
    this.loading = true;
    this.buses = [];
    this.cdr.detectChanges();

    this.http.get<any[]>(this.BUS_API, this.getBusHeaders()).subscribe({
      next: (data) => {
        this.buses = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.showMsg('error', '❌ Backend se connect nahi ho pa raha!');
      }
    });
  }

  openAddForm() {
    this.editMode = false;
    this.currentEditId = '';
    this.formData = { busName: '', busNumber: '', from: '', to: '', departure: '', totalSeats: 40, price: 0 };
    this.showForm = true;
    this.cdr.detectChanges();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  }

  editBus(bus: any) {
    this.editMode = true;
    this.currentEditId = bus._id;
    this.formData = {
      busName:    bus.busName    || bus.name     || '',
      busNumber:  bus.busNumber  || bus.operator || '',
      from:       bus.from       || '',
      to:         bus.to         || '',
      departure:  bus.departure  || '',
      totalSeats: bus.totalSeats || bus.seats    || 40,
      price:      bus.price      || 0
    };
    this.showForm = true;
    this.cdr.detectChanges();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  }

  saveBus() {
    if (!this.formData.busName || !this.formData.busNumber ||
        !this.formData.from || !this.formData.to) return;

    if (this.editMode) {
      this.http.put(`${this.BUS_API}/${this.currentEditId}`, this.formData, this.getBusHeaders())
        .subscribe({
          next: () => { this.showMsg('success', '✅ Bus updated!'); this.closeForm(); this.loadBuses(); },
          error: () => this.showMsg('error', '❌ Failed to update bus!')
        });
    } else {
      this.http.post(this.BUS_API, this.formData, this.getBusHeaders())
        .subscribe({
          next: () => { this.showMsg('success', '✅ Bus added!'); this.closeForm(); this.loadBuses(); },
          error: () => this.showMsg('error', '❌ Failed to add bus!')
        });
    }
  }

  deleteBus(id: string) {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    this.http.delete(`${this.BUS_API}/${id}`, this.getBusHeaders())
      .subscribe({
        next: () => { this.showMsg('success', '✅ Bus deleted!'); this.loadBuses(); },
        error: () => this.showMsg('error', '❌ Failed to delete bus!')
      });
  }

  closeForm() {
    this.showForm = false;
    this.editMode = false;
    this.formData = { busName: '', busNumber: '', from: '', to: '', departure: '', totalSeats: 40, price: 0 };
    this.cdr.detectChanges();
  }

  // ══════════════════════════════════════
  // USERS
  // ══════════════════════════════════════

  loadUsers() {
    this.loadingUsers = true;
    this.users = [];
    this.cdr.detectChanges();

    this.http.get<any[]>(this.USER_API, this.getAdminHeaders()).subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : [];
        this.loadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingUsers = false;
        this.cdr.detectChanges();
        if (err.status === 401 || err.status === 403) {
          this.showMsg('error', '❌ Session expired!');
          setTimeout(() => this.logout(), 2000);
        } else {
          this.showMsg('error', '❌ Failed to load users!');
        }
      }
    });
  }

  deleteUser(id: string) {
    if (!confirm('Delete this user?')) return;
    this.http.delete(`${this.USER_API}/${id}`, this.getAdminHeaders())
      .subscribe({
        next: () => { this.showMsg('success', '✅ User deleted!'); this.loadUsers(); },
        error: () => this.showMsg('error', '❌ Failed to delete user!')
      });
  }

  // ══════════════════════════════════════
  // BOOKINGS ✅ NEW
  // ══════════════════════════════════════

  loadBookings() {
    this.loadingBookings = true;
    this.bookings = [];
    this.cdr.detectChanges();

    this.http.get<any[]>(this.BOOKING_API, this.getBusHeaders()).subscribe({
      next: (data) => {
        this.bookings = Array.isArray(data) ? data : [];
        this.loadingBookings = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingBookings = false;
        this.showMsg('error', '❌ Failed to load bookings!');
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    }
    this.router.navigate(['/admin']);
  }
}