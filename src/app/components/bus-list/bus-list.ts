import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './bus-list.html',
  styleUrl: './bus-list.css',
})
export class BusList implements OnInit {

  from = '';
  to = '';
  date = '';
  loading = true;
  buses: any[] = [];
  noResults = false;
  isPastDate = false;
  formattedDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
  // ✅ Query params change hone pe reload karo
  this.route.queryParams.subscribe(params => {
    this.from = params['from'] || '';
    this.to   = params['to']   || '';
    this.date = params['date'] || '';
    this.formattedDate = this.FormattedDate(this.date);
    this.buses = [];
    this.noResults = false;
    this.isPastDate = false;

    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token   = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!userStr || !token) { this.router.navigate(['/login']); return; }

    if (this.date) {
      const today = new Date(); today.setHours(0,0,0,0);
      const [y,m,d] = this.date.split('-').map(Number);
      const sel = new Date(y, m-1, d); sel.setHours(0,0,0,0);
      if (sel < today) { this.isPastDate = true; this.loading = false; return; }
    }

    if (this.from && this.to) { this.loadBuses(); }
    else { this.loading = false; this.noResults = true; }
  });
}

  trackBus(index: number, bus: any) {
    return bus._id || index;
  }

  FormattedDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  filterBuses(buses: any[]): any[] {
    const today = new Date();
    const [year, month, day] = this.date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const isToday = selectedDate.toDateString() === today.toDateString();

    if (!isToday) {
      return buses; // Future date — sab buses dikhao
    }

    // Aaj ki date — sirf abhi ke baad wali buses dikhao
    const currentMinutes = today.getHours() * 60 + today.getMinutes();

    return buses.filter(bus => {
      const [depH, depM] = bus.departure.split(':').map(Number);
      const depMinutes = depH * 60 + depM;
      return depMinutes >= currentMinutes;
    });
  }

  generateBusesForRoute(from: string, to: string): any[] {
    const operators = [
      'VRL Travels', 'SRS Travels', 'Orange Travels', 'RedBus Express',
      'IntrCity SmartBus', 'GSRTC', 'MSRTC', 'KSRTC', 'Shyamoli Travels',
      'Neeta Tours', 'Paulo Travels', 'Sharma Transports'
    ];
    const types = [
      'AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Volvo AC',
      'Semi Sleeper', 'Non-AC Seater', 'AC Multi-Axle'
    ];
    const names = [
      'Express Cruiser', 'Night Queen', 'Rajdhani Express', 'Volvo Gold Class',
      'Budget Express', 'Shatabdi Luxury', 'Metro Link', 'City Connect'
    ];
    const amenitiesList = [
      ['WiFi', 'Charging', 'Water Bottle'],
      ['AC', 'Charging', 'Blanket'],
      ['WiFi', 'AC', 'Snacks'],
      ['Charging', 'Water Bottle', 'Pillow'],
      ['AC', 'WiFi', 'Reading Light'],
    ];

    const seed = from.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
               + to.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const count = 4 + (seed % 5);
    const departureTimes = ['05:30', '06:00', '08:00', '10:00', '12:30', '15:00', '18:00', '20:30', '22:00', '23:30'];
    const baseDuration = 3 + (seed % 9);

    return Array.from({ length: count }, (_, i) => {
      const idx = (seed + i * 7) % 10;
      const depTime = departureTimes[idx];
      const [depH, depM] = depTime.split(':').map(Number);
      const arrH = (depH + baseDuration + Math.floor(depM / 60)) % 24;
      const arrM = depM % 60;
      const arrival = `${arrH.toString().padStart(2, '0')}:${arrM.toString().padStart(2, '0')}`;

      return {
        _id: `mock-${seed}-${i}`,
        name: names[(seed + i * 3) % names.length],
        operator: operators[(seed + i * 5) % operators.length],
        type: types[(seed + i * 2) % types.length],
        departure: depTime,
        arrival: arrival,
        duration: `${baseDuration} hrs`,
        price: 199 + ((seed + i * 47) % 20) * 25,
        seats: 5 + ((seed + i * 13) % 35),
        rating: (3.5 + ((seed + i * 3) % 15) / 10).toFixed(1),
        amenities: amenitiesList[(seed + i) % amenitiesList.length]
      };
    });
  }

  loadBuses() {
    this.loading = true;
    this.noResults = false;

    const url = `http://localhost:5000/api/buses?from=${encodeURIComponent(this.from)}&to=${encodeURIComponent(this.to)}`;

    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        const allBuses = (res && res.length > 0) ? [...res] : this.generateBusesForRoute(this.from, this.to);
        this.buses = this.filterBuses(allBuses);
        this.noResults = this.buses.length === 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        const allBuses = this.generateBusesForRoute(this.from, this.to);
        this.buses = this.filterBuses(allBuses);
        this.noResults = this.buses.length === 0;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ Kal ki date pe same route search karo
  searchTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    this.router.navigate(['/bus-list'], {
      queryParams: { from: this.from, to: this.to, date: tomorrowStr }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  bookBus(bus: any) {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token   = localStorage.getItem('token') || sessionStorage.getItem('token');

    let isLoggedIn = false;
    try {
      if (userStr && token) {
        const user = JSON.parse(userStr);
        if (user && user.email) isLoggedIn = true;
      }
    } catch (e) { isLoggedIn = false; }

    if (!isLoggedIn) {
      localStorage.setItem('lastFrom', this.from);
      localStorage.setItem('lastTo', this.to);
      localStorage.setItem('lastDate', this.date);
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/book-ticket'], {
      queryParams: {
        busId:     bus._id || bus.id,
        busName:   bus.name,
        operator:  bus.operator,
        type:      bus.type,
        departure: bus.departure,
        arrival:   bus.arrival,
        rating:    bus.rating,
        seats:     bus.seats,
        from:      this.from,
        to:        this.to,
        date:      this.date,
        price:     bus.price
      }
    });
  }
}