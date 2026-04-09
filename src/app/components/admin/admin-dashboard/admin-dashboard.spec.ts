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
  successMsg = '';
  errorMsg = '';

  formData = {
    busName: '', busNumber: '', from: '', to: '',
    departure: '', totalSeats: 40, price: 0
  };

  private BUS_API  = 'http://localhost:5000/api/buses';
  private USER_API = 'http://localhost:5000/api/users';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,                              // ✅ NgZone add
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      this.router.navigate(['/admin']);
      return;
    }
    this.loadBuses();
  }

  private getAdminHeaders(): { headers: HttpHeaders } {
    const token = isPlatformBrowser(this.platformId)
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
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      })
    };
  }

  private showMsg(type: 'success' | 'error', msg: string) {
    this.zone.run(() => {
      this.successMsg = type === 'success' ? msg : '';
      this.errorMsg   = type === 'error'   ? msg : '';
      setTimeout(() => { this.successMsg = ''; this.errorMsg = ''; }, 3000);
    });
  }

  switchSection(section: string) {
    this.currentSection = section;
    this.closeForm();
    this.successMsg = '';
    this.errorMsg = '';
    if (section === 'users') this.loadUsers();
    if (section === 'buses') this.loadBuses();
  }

  loadBuses() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loading = true;
    this.buses = [];

    this.http.get<any[]>(this.BUS_API, this.getBusHeaders()).subscribe({
      next: (data) => {
        // ✅ NgZone.run() — Angular ke andar force update
        this.zone.run(() => {
          this.buses = data || [];
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loading = false;
          this.showMsg('error', '❌ Backend se connect nahi ho pa raha!');
          this.cdr.detectChanges();
        });
        console.error('Load buses error:', err);
      }
    });
  }

  openAddForm() {
    this.zone.run(() => {
      this.editMode = false;
      this.currentEditId = '';
      this.formData = { busName: '', busNumber: '', from: '', to: '', departure: '', totalSeats: 40, price: 0 };
      this.showForm = true;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editBus(bus: any) {
    this.zone.run(() => {
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
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  saveBus() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.formData.busName || !this.formData.busNumber ||
        !this.formData.from || !this.formData.to) {
      this.showMsg('error', 'Please fill all required fields (*)!');
      return;
    }

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
    if (!isPlatformBrowser(this.platformId)) return;
    if (!confirm('Are you sure you want to delete this bus?')) return;
    this.http.delete(`${this.BUS_API}/${id}`, this.getBusHeaders())
      .subscribe({
        next: () => { this.showMsg('success', '✅ Bus deleted!'); this.loadBuses(); },
        error: () => this.showMsg('error', '❌ Failed to delete bus!')
      });
  }

  closeForm() {
    this.zone.run(() => {
      this.showForm = false;
      this.editMode = false;
      this.formData = { busName: '', busNumber: '', from: '', to: '', departure: '', totalSeats: 40, price: 0 };
    });
  }

  loadUsers() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadingUsers = true;
    this.users = [];

    this.http.get<any[]>(this.USER_API, this.getAdminHeaders()).subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.users = data || [];
          this.loadingUsers = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loadingUsers = false;
          if (err.status === 401 || err.status === 403) {
            this.showMsg('error', '❌ Session expired!');
            setTimeout(() => this.logout(), 2000);
          } else {
            this.showMsg('error', '❌ Failed to load users!');
          }
        });
      }
    });
  }

  deleteUser(id: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!confirm('Delete this user?')) return;
    this.http.delete(`${this.USER_API}/${id}`, this.getAdminHeaders())
      .subscribe({
        next: () => { this.showMsg('success', '✅ User deleted!'); this.loadUsers(); },
        error: () => this.showMsg('error', '❌ Failed to delete user!')
      });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    }
    this.router.navigate(['/admin']);
  }
}