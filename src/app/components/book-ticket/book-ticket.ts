import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './book-ticket.html',
  styleUrl: './book-ticket.css'
})
export class BookTicket implements OnInit {

  bus: any = null;
  from = '';
  to = '';
  date = '';

  totalSeats = 40;
  // ✅ Booked seats real-time backend se aayenge
  bookedSeats: number[] = [];
  selectedSeats: number[] = [];

  passengers: any[] = [];
  passengerCount = 1;

  basePrice = 0;
  totalPrice = 0;
  taxes = 0;

  currentStep = 1;
  bookingSuccess = false;
  bookingId = '';
  isBooking = false;
  loadingSeats = false; // ✅ Loading state for seats

  paymentMethod = '';
  upiApp = '';
  upiId = '';
  cardType = 'debit';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  cardName = '';
  selectedBank = '';
  accountNumber = '';
  ifscCode = '';
  userName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  formatCard() {
    this.cardNumber = this.cardNumber
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!user || !token) {
      this.router.navigate(['/login']);
      return;
    }

    const userObj = JSON.parse(user);
    this.userName = userObj.name || 'User';

    const params = this.route.snapshot.queryParams;
    this.from      = params['from']      || '';
    this.to        = params['to']        || '';
    this.date      = params['date']      || '';
    this.basePrice = +params['price']    || 500;

    this.bus = {
      _id:       params['busId'],
      name:      params['busName']    || 'Express Bus',
      operator:  params['operator']   || 'BusGoPro Travels',
      type:      params['type']       || 'AC Seater',
      departure: params['departure']  || '08:00',
      arrival:   params['arrival']    || '13:00',
      rating:    params['rating']     || 4.5,
      seats:     +params['seats']     || 40,
      price:     this.basePrice
    };

    // ✅ Backend se real booked seats lo
    this.loadBookedSeats();
    this.updatePassengers();
    this.calculatePrice();
  }

  loadBookedSeats() {
  if (!isPlatformBrowser(this.platformId)) return;

  this.loadingSeats = true;
  const busId = this.bus?._id || '';
  const date  = this.date     || '';

  this.http.get<any>(
    `http://localhost:5000/api/bookings/booked-seats?busId=${encodeURIComponent(busId)}&date=${encodeURIComponent(date)}`
  ).subscribe({
    next: (res) => {
      this.bookedSeats = res.bookedSeats || [];
      this.loadingSeats = false;
      this.cdr.detectChanges(); // ✅ Force UI update
    },
    error: () => {
      this.bookedSeats = [];
      this.loadingSeats = false;
      this.cdr.detectChanges(); // ✅ Force UI update
    }
  });
}
  getSeatRows() {
    const rows = [];
    for (let i = 1; i <= this.totalSeats; i += 4) {
      const row = [];
      row.push(i);
      row.push(i + 1);
      row.push(null);
      if (i + 2 <= this.totalSeats) row.push(i + 2);
      if (i + 3 <= this.totalSeats) row.push(i + 3);
      rows.push(row);
    }
    return rows;
  }

  isSeatBooked(seat: number) { return this.bookedSeats.includes(seat); }
  isSeatSelected(seat: number) { return this.selectedSeats.includes(seat); }

  getSeatClass(seat: number | null) {
    if (seat === null) return 'aisle';
    if (this.isSeatBooked(seat)) return 'seat booked';
    if (this.isSeatSelected(seat)) return 'seat selected';
    return 'seat available';
  }

  toggleSeat(seat: number | null) {
    if (seat === null) return;
    if (this.isSeatBooked(seat)) return; // ✅ Booked seat select nahi ho sakti
    if (this.isSeatSelected(seat)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
    } else {
      this.selectedSeats.push(seat);
    }
    this.calculatePrice();
  }

  updatePassengers() {
    while (this.passengers.length < this.passengerCount) {
      this.passengers.push({ name: '', age: '', gender: 'Male' });
    }
    while (this.passengers.length > this.passengerCount) {
      this.passengers.pop();
    }
    this.calculatePrice();
  }

  increasePassenger() {
    if (this.passengerCount < 6) { this.passengerCount++; this.updatePassengers(); }
  }

  decreasePassenger() {
    if (this.passengerCount > 1) { this.passengerCount--; this.updatePassengers(); }
  }

  calculatePrice() {
    this.taxes = Math.round(this.basePrice * this.passengerCount * 0.05);
    this.totalPrice = (this.basePrice * this.passengerCount) + this.taxes;
  }

  goToStep2() {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least 1 seat!');
      return;
    }
    this.passengerCount = this.selectedSeats.length;
    this.passengers = this.selectedSeats.map(() => ({ name: '', age: '', gender: 'Male' }));
    this.calculatePrice();
    this.currentStep = 2;
    window.scrollTo(0, 0);
  }

  goToStep3() {
    for (let p of this.passengers) {
      if (!p.name || !p.age) {
        alert('Please fill all passenger details!');
        return;
      }
    }
    this.currentStep = 3;
    window.scrollTo(0, 0);
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['/bus-list'], {
        queryParams: { from: this.from, to: this.to, date: this.date }
      });
    }
  }

  confirmBooking() {
    if (!this.paymentMethod) {
      alert('Please select a payment method!');
      return;
    }
    if (this.isBooking) return;
    this.isBooking = true;

    this.bookingId = 'BK' + Date.now();
    this.bookingSuccess = true;
    window.scrollTo(0, 0);

    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const bookingData = {
          userId:        user.id,
          userName:      user.name,
          userEmail:     user.email,
          userPhone:     user.phone,
          busId:         this.bus?._id   || '',
          busName:       this.bus?.name  || '',
          busOperator:   this.bus?.operator || '',
          busType:       this.bus?.type  || '',
          from:          this.from,
          to:            this.to,
          date:          this.date,
          departure:     this.bus?.departure || '',
          arrival:       this.bus?.arrival   || '',
          seats:         this.passengerCount,
          selectedSeats: this.selectedSeats,
          passengers:    this.passengers,
          basePrice:     this.basePrice,
          taxes:         this.taxes,
          totalPrice:    this.totalPrice,
          paymentMethod: this.paymentMethod,
          bookingId:     this.bookingId,
          status:        'confirmed',
          bookedAt:      new Date()
        };

        this.http.post('http://localhost:5000/api/bookings', bookingData)
          .subscribe({
            next: (res) => { console.log('✅ Saved:', res); },
            error: (err) => { console.log('❌ Error:', err); }
          });
      }
    }
  }

  // PDF Download
  downloadTicket() {
    const passengersHtml = this.passengers.map((p, i) => `
      <tr>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${i + 1}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0; font-weight:600;">${p.name}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${p.age} yrs</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${p.gender}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">
          <span style="background:#2563eb;color:white;padding:3px 10px;border-radius:20px;font-size:12px;">Seat ${this.selectedSeats[i]}</span>
        </td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>BusGoPro Ticket</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#f1f5f9;padding:20px}
    .ticket{background:white;max-width:700px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.12)}
    .hdr{background:linear-gradient(135deg,#1e3a5f,#2563eb);color:white;padding:24px 28px;display:flex;justify-content:space-between;align-items:center}
    .logo{font-size:22px;font-weight:800}.logo span{color:#f59e0b}
    .bid{font-size:13px;opacity:.85}.bid strong{font-size:15px;display:block}
    .sbar{background:#16a34a;color:white;text-align:center;padding:10px;font-weight:700;font-size:15px}
    .body{padding:24px 28px}
    .route{display:flex;align-items:center;gap:16px;background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px}
    .city{text-align:center;flex:1}.cn{font-size:22px;font-weight:800;color:#1e293b}.ct{font-size:14px;color:#64748b;margin-top:4px}
    .arr{text-align:center;font-size:28px;color:#2563eb}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
    .item{background:#f8fafc;border-radius:10px;padding:12px 16px}
    .lbl{font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase}.val{font-size:15px;font-weight:700;color:#1e293b;margin-top:4px}
    .st{font-size:14px;font-weight:700;color:#374151;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #e2e8f0}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}thead tr{background:#1e3a5f;color:white}thead th{padding:10px 12px;text-align:left;font-size:13px}
    .pb{background:#f0fdf4;border-radius:10px;padding:16px 20px;border:1px solid #bbf7d0}
    .pr{display:flex;justify-content:space-between;font-size:14px;color:#64748b;margin-bottom:6px}
    .pt{display:flex;justify-content:space-between;font-size:18px;font-weight:800;color:#16a34a;border-top:2px solid #bbf7d0;padding-top:10px;margin-top:6px}
    .footer{background:#f8fafc;padding:16px 28px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0}
    @media print{body{background:white;padding:0}.ticket{box-shadow:none}}</style></head><body>
    <div class="ticket">
      <div class="hdr"><div class="logo">🚌 BusGo<span>Pro</span></div><div class="bid">Booking ID<strong>${this.bookingId}</strong></div></div>
      <div class="sbar">✅ BOOKING CONFIRMED</div>
      <div class="body">
        <div class="route">
          <div class="city"><div class="cn">${this.from}</div><div class="ct">${this.bus?.departure}</div></div>
          <div class="arr">→</div>
          <div class="city"><div class="cn">${this.to}</div><div class="ct">${this.bus?.arrival}</div></div>
        </div>
        <div class="grid">
          <div class="item"><div class="lbl">Bus Name</div><div class="val">${this.bus?.name}</div></div>
          <div class="item"><div class="lbl">Operator</div><div class="val">${this.bus?.operator}</div></div>
          <div class="item"><div class="lbl">Bus Type</div><div class="val">${this.bus?.type}</div></div>
          <div class="item"><div class="lbl">Journey Date</div><div class="val">${this.formatDate(this.date)}</div></div>
          <div class="item"><div class="lbl">Seats</div><div class="val">${this.selectedSeats.join(', ')}</div></div>
          <div class="item"><div class="lbl">Payment</div><div class="val">${this.paymentMethod.toUpperCase()}</div></div>
        </div>
        <div class="st">👥 Passenger Details</div>
        <table><thead><tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Seat</th></tr></thead><tbody>${passengersHtml}</tbody></table>
        <div class="pb">
          <div class="pr"><span>Base Fare (${this.passengerCount} × ₹${this.basePrice})</span><span>₹${this.basePrice * this.passengerCount}</span></div>
          <div class="pr"><span>GST (5%)</span><span>₹${this.taxes}</span></div>
          <div class="pt"><span>Total Paid</span><span>₹${this.totalPrice}</span></div>
        </div>
      </div>
      <div class="footer">BusGoPro • support@busgopro.in • 1800-123-4567</div>
    </div>
    <script>window.onload=function(){window.print()}</script></body></html>`;

    const w = window.open('', '_blank', 'width=800,height=900');
    if (w) { w.document.write(html); w.document.close(); }
  }

  formatDate(dateStr: string) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  getDuration() {
    if (!this.bus) return '';
    const dep = this.bus.departure?.split(':');
    const arr = this.bus.arrival?.split(':');
    if (!dep || !arr) return '';
    let mins = (parseInt(arr[0]) * 60 + parseInt(arr[1])) -
               (parseInt(dep[0]) * 60 + parseInt(dep[1]));
    if (mins < 0) mins += 24 * 60;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  goHome() { this.router.navigate(['/']); }
}