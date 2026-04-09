import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-live-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './live-tracking.html',
  styleUrl: './live-tracking.css'
})
export class LiveTracking implements OnInit, OnDestroy {

  // Booking info
  busName = '';
  busOperator = '';
  from = '';
  to = '';
  departure = '';
  arrival = '';
  date = '';
  selectedSeats: string[] = [];

  // Tracking state
  isTracking = false;
  progressPercent = 0;
  estimatedArrival = '';
  distanceCovered = 0;
  totalDistance = 0;
  speed = 0;
  statusMsg = 'Calculating position...';
  timeElapsed = '';
  timeRemaining = '';
  journeyStarted = false;
  journeyCompleted = false;

  // Journey times
  private departureTime: Date = new Date();
  private arrivalTime: Date = new Date();
  private totalJourneyMinutes = 0;

  // Map
  private map: any = null;
  private busMarker: any = null;
  private routeLine: any = null;
  private trackingInterval: any = null;
  private routeCoords: [number, number][] = [];

  private cityCoords: { [key: string]: [number, number] } = {
    'Delhi': [28.6139, 77.2090],
    'Noida': [28.5355, 77.3910],
    'Gurgaon': [28.4595, 77.0266],
    'Faridabad': [28.4089, 77.3178],
    'Ghaziabad': [28.6692, 77.4538],
    'Agra': [27.1767, 78.0081],
    'Mathura': [27.4924, 77.6737],
    'Jaipur': [26.9124, 75.7873],
    'Jodhpur': [26.2389, 73.0243],
    'Udaipur': [24.5854, 73.7125],
    'Mumbai': [19.0760, 72.8777],
    'Pune': [18.5204, 73.8567],
    'Nashik': [19.9975, 73.7898],
    'Ahmedabad': [23.0225, 72.5714],
    'Surat': [21.1702, 72.8311],
    'Vadodara': [22.3072, 73.1812],
    'Bangalore': [12.9716, 77.5946],
    'Mysore': [12.2958, 76.6394],
    'Chennai': [13.0827, 80.2707],
    'Coimbatore': [11.0168, 76.9558],
    'Madurai': [9.9252, 78.1198],
    'Hyderabad': [17.3850, 78.4867],
    'Vijayawada': [16.5062, 80.6480],
    'Visakhapatnam': [17.6868, 83.2185],
    'Kolkata': [22.5726, 88.3639],
    'Patna': [25.5941, 85.1376],
    'Lucknow': [26.8467, 80.9462],
    'Kanpur': [26.4499, 80.3319],
    'Varanasi': [25.3176, 82.9739],
    'Chandigarh': [30.7333, 76.7794],
    'Amritsar': [31.6340, 74.8723],
    'Ludhiana': [30.9010, 75.8573],
    'Indore': [22.7196, 75.8577],
    'Bhopal': [23.2599, 77.4126],
    'Nagpur': [21.1458, 79.0882],
    'Goa': [15.2993, 74.1240],
    'Kochi': [9.9312, 76.2673],
    'Mangalore': [12.9141, 74.8560],
    'Dehradun': [30.3165, 78.0322],
    'Haridwar': [29.9457, 78.1642],
    'Shimla': [31.1048, 77.1734],
    'Manali': [32.2432, 77.1892],
    'Guwahati': [26.1445, 91.7362],
    'Ranchi': [23.3441, 85.3096],
    'Bhubaneswar': [20.2961, 85.8245],
    'Pondicherry': [11.9416, 79.8083],
    'Siliguri': [26.7271, 88.3953],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = this.route.snapshot.queryParams;
    this.busName     = params['busName']     || 'Express Bus';
    this.busOperator = params['busOperator'] || 'BusGoPro';
    this.from        = params['from']        || 'Delhi';
    this.to          = params['to']          || 'Jaipur';
    this.departure   = params['departure']   || '08:00';
    this.arrival     = params['arrival']     || '14:00';
    this.date        = params['date']        || '';
    this.selectedSeats = params['seats'] ? params['seats'].split(',') : [];

    // ✅ Calculate real departure & arrival times
    this.calculateJourneyTimes();

    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy() {
    this.stopRealTimeTracking();
    if (this.map) { this.map.remove(); this.map = null; }
  }

  // ✅ Parse journey date + time into real Date objects
  calculateJourneyTimes() {
    const journeyDate = this.date || new Date().toISOString().split('T')[0];
    const [year, month, day] = journeyDate.split('-').map(Number);

    const [depH, depM] = this.departure.split(':').map(Number);
    const [arrH, arrM] = this.arrival.split(':').map(Number);

    this.departureTime = new Date(year, month - 1, day, depH, depM, 0);
    this.arrivalTime   = new Date(year, month - 1, day, arrH, arrM, 0);

    // Handle overnight journey (arrival next day)
    if (this.arrivalTime <= this.departureTime) {
      this.arrivalTime.setDate(this.arrivalTime.getDate() + 1);
    }

    this.totalJourneyMinutes = (this.arrivalTime.getTime() - this.departureTime.getTime()) / (1000 * 60);
  }

  async initMap() {
    try {
      const L = await import('leaflet' as any);

      const fromCoord = this.cityCoords[this.from] || [20.5937, 78.9629];
      const toCoord   = this.cityCoords[this.to]   || [28.6139, 77.2090];

      this.routeCoords  = this.generateRoute(fromCoord, toCoord);
      this.totalDistance = Math.round(this.haversineDistance(fromCoord, toCoord));

      const centerLat = (fromCoord[0] + toCoord[0]) / 2;
      const centerLng = (fromCoord[1] + toCoord[1]) / 2;

      this.map = L.map('tracking-map').setView([centerLat, centerLng], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map);

      this.routeLine = L.polyline(this.routeCoords, {
        color: '#2563eb', weight: 4, opacity: 0.6, dashArray: '8, 6'
      }).addTo(this.map);

      // From marker
      const fromIcon = L.divIcon({
        html: `<div style="background:#16a34a;color:white;padding:6px 10px;border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3)">📍 ${this.from}</div>`,
        className: '', iconAnchor: [0, 20]
      });
      L.marker(fromCoord, { icon: fromIcon }).addTo(this.map);

      // To marker
      const toIcon = L.divIcon({
        html: `<div style="background:#dc2626;color:white;padding:6px 10px;border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🏁 ${this.to}</div>`,
        className: '', iconAnchor: [0, 20]
      });
      L.marker(toCoord, { icon: toIcon }).addTo(this.map);

      // Bus marker at current real position
      const busIcon = L.divIcon({
        html: `<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">🚌</div>`,
        className: '', iconAnchor: [14, 14]
      });

      // ✅ Calculate current real position
      const currentProgress = this.getCurrentProgress();
      const startCoord = this.getCoordAtProgress(currentProgress);

      this.busMarker = L.marker(startCoord, { icon: busIcon }).addTo(this.map);
      this.map.fitBounds(this.routeLine.getBounds(), { padding: [40, 40] });

      // ✅ Start real-time tracking immediately
      this.startRealTimeTracking();

    } catch (err) {
      console.error('Map init error:', err);
    }
  }

  // ✅ Calculate how far bus has traveled based on REAL current time
  getCurrentProgress(): number {
    const now = new Date();

    if (now < this.departureTime) {
      // Bus not departed yet
      return 0;
    }

    if (now >= this.arrivalTime) {
      // Bus already arrived
      return 100;
    }

    const elapsed = (now.getTime() - this.departureTime.getTime()) / (1000 * 60); // minutes
    return Math.min(100, Math.round((elapsed / this.totalJourneyMinutes) * 100));
  }

  // Get interpolated coordinate at given progress (0-100)
  getCoordAtProgress(progress: number): [number, number] {
    if (!this.routeCoords.length) return [20.5937, 78.9629];
    const idx = Math.floor((progress / 100) * (this.routeCoords.length - 1));
    return this.routeCoords[Math.min(idx, this.routeCoords.length - 1)];
  }

  // ✅ Real-time tracking — updates every 30 seconds based on actual clock
  startRealTimeTracking() {
    this.isTracking = true;
    this.updatePosition(); // immediate update

    // Update every 30 seconds
    this.trackingInterval = setInterval(() => {
      this.updatePosition();
    }, 30000);
  }

  updatePosition() {
    const now = new Date();
    const progress = this.getCurrentProgress();

    this.zone.run(() => {
      this.progressPercent = progress;
      this.distanceCovered = Math.round((progress / 100) * this.totalDistance);
      this.speed = progress > 0 && progress < 100 ? 55 + Math.floor(Math.random() * 25) : 0;

      // Time elapsed
      if (now >= this.departureTime) {
        const elapsedMs = Math.min(now.getTime() - this.departureTime.getTime(),
                                   this.arrivalTime.getTime() - this.departureTime.getTime());
        const elapsedMin = Math.floor(elapsedMs / (1000 * 60));
        const elH = Math.floor(elapsedMin / 60);
        const elM = elapsedMin % 60;
        this.timeElapsed = elH > 0 ? `${elH}h ${elM}m` : `${elM}m`;
      }

      // Time remaining
      if (now < this.arrivalTime && progress > 0) {
        const remainMs = this.arrivalTime.getTime() - now.getTime();
        const remainMin = Math.floor(remainMs / (1000 * 60));
        const remH = Math.floor(remainMin / 60);
        const remM = remainMin % 60;
        this.timeRemaining = remH > 0 ? `${remH}h ${remM}m` : `${remM}m`;
        this.estimatedArrival = this.arrival;
      } else if (progress >= 100) {
        this.timeRemaining = 'Arrived';
        this.estimatedArrival = this.arrival;
      }

      // Status message
      if (now < this.departureTime) {
        const minsToDepart = Math.floor((this.departureTime.getTime() - now.getTime()) / (1000 * 60));
        this.statusMsg = `🕐 Bus departs in ${minsToDepart} min`;
        this.journeyStarted = false;
      } else if (progress >= 100) {
        this.statusMsg = `✅ Bus arrived at ${this.to}`;
        this.journeyCompleted = true;
        this.journeyStarted = true;
        this.stopRealTimeTracking();
      } else if (progress < 20) {
        this.statusMsg = `🚌 Bus just departed from ${this.from}`;
        this.journeyStarted = true;
      } else if (progress < 50) {
        this.statusMsg = `🛣️ On the way — heading towards ${this.to}`;
        this.journeyStarted = true;
      } else if (progress < 80) {
        this.statusMsg = `⚡ More than halfway! ${this.timeRemaining} remaining`;
        this.journeyStarted = true;
      } else {
        this.statusMsg = `🏁 Almost there! Approaching ${this.to}`;
        this.journeyStarted = true;
      }

      // Update bus marker position on map
      if (this.busMarker && this.routeCoords.length > 0) {
        const coord = this.getCoordAtProgress(progress);
        this.busMarker.setLatLng(coord);
        if (progress > 0 && progress < 100) {
          this.map.panTo(coord, { animate: true, duration: 1 });
        }
      }

      this.cdr.detectChanges();
    });
  }

  stopRealTimeTracking() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    this.zone.run(() => {
      this.isTracking = false;
      this.cdr.detectChanges();
    });
  }

  // Generate smooth route
  generateRoute(from: [number, number], to: [number, number]): [number, number][] {
    const steps = 100;
    const coords: [number, number][] = [];
    const midLat = (from[0] + to[0]) / 2 + (Math.random() - 0.5) * 0.8;
    const midLng = (from[1] + to[1]) / 2 + (Math.random() - 0.5) * 0.8;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let lat, lng;
      if (t < 0.5) {
        lat = from[0] + (midLat - from[0]) * (t * 2);
        lng = from[1] + (midLng - from[1]) * (t * 2);
      } else {
        lat = midLat + (to[0] - midLat) * ((t - 0.5) * 2);
        lng = midLng + (to[1] - midLng) * ((t - 0.5) * 2);
      }
      coords.push([lat, lng]);
    }
    return coords;
  }

  haversineDistance(a: [number, number], b: [number, number]): number {
    const R = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const x = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(a[0] * Math.PI/180) * Math.cos(b[0] * Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m-1, d).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  goBack() { this.router.navigate(['/my-bookings']); }
}