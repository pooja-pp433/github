import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit {

  bookings: any[] = [];
  loading = true;
  userName = '';
  userId = '';

  showCancelModal = false;
  selectedBooking: any = null;
  cancelling = false;
  cancelResult: any = null;

  private API = 'https://github-1-gezb.onrender.com';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token   = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!userStr || !token) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userStr);
    this.userName = user.name || 'User';
    this.userId   = user.id   || user._id;

    setTimeout(() => this.loadBookings(), 0);
  }

  loadBookings() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.detectChanges();
    });

    this.http.get<any[]>(`${this.API}/user/${this.userId}`).subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.bookings = data || [];
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.bookings = [];
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  // ✅ Check karo booking past mein hai ya nahi
  isPastBooking(dateStr: string): boolean {
    if (!dateStr) return false;
    const [y, m, d] = dateStr.split('-').map(Number);
    const journeyDate = new Date(y, m - 1, d);
    journeyDate.setHours(23, 59, 59, 999);
    return journeyDate < new Date();
  }

  // ✅ Track Bus — live tracking page pe bhejo
  trackBus(b: any) {
    this.router.navigate(['/live-tracking'], {
      queryParams: {
        busName:     b.busName     || '',
        busOperator: b.busOperator || '',
        from:        b.from        || '',
        to:          b.to          || '',
        departure:   b.departure   || '',
        arrival:     b.arrival     || '',
        date:        b.date        || '',
        seats:       (b.selectedSeats || []).join(',')
      }
    });
  }

  openCancelModal(booking: any) {
    this.zone.run(() => {
      this.selectedBooking = booking;
      this.cancelResult = null;
      this.showCancelModal = true;
      this.cdr.detectChanges();
    });
  }

  closeCancelModal() {
    this.zone.run(() => {
      this.showCancelModal = false;
      this.selectedBooking = null;
      this.cancelResult = null;
      this.cancelling = false;
      this.cdr.detectChanges();
    });
  }

  confirmCancel() {
    if (!this.selectedBooking) return;
    this.zone.run(() => { this.cancelling = true; this.cdr.detectChanges(); });

    this.http.put<any>(`${this.API}/${this.selectedBooking._id}/cancel`, {}).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.cancelling = false;
          this.cancelResult = res;
          const idx = this.bookings.findIndex(b => b._id === this.selectedBooking._id);
          if (idx !== -1) {
            this.bookings[idx].status = 'cancelled';
            this.bookings[idx].refundAmount = res.refundAmount;
            this.bookings[idx].refundStatus = res.booking?.refundStatus;
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.cancelling = false;
          this.cancelResult = { error: err.error?.message || 'Failed to cancel!' };
          this.cdr.detectChanges();
        });
      }
    });
  }

  downloadTicket(b: any) {
    const passengersHtml = (b.passengers || []).map((p: any, i: number) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${i + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;">${p.name || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${p.age || '—'} yrs</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${p.gender || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">
          <span style="background:#2563eb;color:white;padding:3px 10px;border-radius:20px;font-size:12px;">Seat ${(b.selectedSeats || [])[i] || '—'}</span>
        </td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>BusGoPro Ticket</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#f1f5f9;padding:20px}
    .ticket{background:white;max-width:700px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.12)}
    .hdr{background:linear-gradient(135deg,#1e3a5f,#2563eb);color:white;padding:24px 28px;display:flex;justify-content:space-between;align-items:center}
    .logo{font-size:22px;font-weight:800}.logo span{color:#f59e0b}
    .bid{font-size:13px;opacity:.85}.bid strong{font-size:15px;display:block}
    .sbar{background:${b.status==='cancelled'?'#ef4444':'#16a34a'};color:white;text-align:center;padding:10px;font-weight:700;font-size:15px}
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
      <div class="hdr"><div class="logo">🚌 BusGo<span>Pro</span></div><div class="bid">Booking ID<strong>${b.bookingId||b._id}</strong></div></div>
      <div class="sbar">${b.status==='cancelled'?'❌ CANCELLED':'✅ CONFIRMED'}</div>
      <div class="body">
        <div class="route">
          <div class="city"><div class="cn">${b.from}</div><div class="ct">${b.departure}</div></div>
          <div class="arr">→</div>
          <div class="city"><div class="cn">${b.to}</div><div class="ct">${b.arrival}</div></div>
        </div>
        <div class="grid">
          <div class="item"><div class="lbl">Bus Name</div><div class="val">${b.busName}</div></div>
          <div class="item"><div class="lbl">Operator</div><div class="val">${b.busOperator||'—'}</div></div>
          <div class="item"><div class="lbl">Bus Type</div><div class="val">${b.busType||'—'}</div></div>
          <div class="item"><div class="lbl">Journey Date</div><div class="val">${b.date}</div></div>
          <div class="item"><div class="lbl">Seats</div><div class="val">${(b.selectedSeats||[]).join(', ')}</div></div>
          <div class="item"><div class="lbl">Payment</div><div class="val">${(b.paymentMethod||'').toUpperCase()}</div></div>
        </div>
        <div class="st">👥 Passenger Details</div>
        <table><thead><tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Seat</th></tr></thead><tbody>${passengersHtml}</tbody></table>
        <div class="pb">
          <div class="pr"><span>Base Fare</span><span>₹${(b.basePrice||0)*(b.seats||1)}</span></div>
          <div class="pr"><span>GST (5%)</span><span>₹${b.taxes||0}</span></div>
          <div class="pt"><span>Total Paid</span><span>₹${b.totalPrice}</span></div>
          ${b.status==='cancelled'?`<div class="pr" style="margin-top:8px;color:#ef4444;font-weight:600"><span>Refund Amount</span><span>₹${b.refundAmount||0}</span></div>`:''}
        </div>
      </div>
      <div class="footer">BusGoPro • support@busgopro.in • 1800-123-4567</div>
    </div>
    <script>window.onload=function(){window.print()}</script></body></html>`;

    const w = window.open('', '_blank', 'width=800,height=900');
    if (w) { w.document.write(html); w.document.close(); }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m-1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  goHome() { this.router.navigate(['/']); }
}
