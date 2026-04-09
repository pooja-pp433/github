import { RouterModule } from '@angular/router';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // ✅ Today's date — min date for date picker
  today = new Date().toISOString().split('T')[0];

  cities = [
    'Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad',
    'Agra', 'Mathura', 'Vrindavan', 'Lucknow', 'Kanpur',
    'Varanasi', 'Prayagraj', 'Ayodhya', 'Gorakhpur', 'Meerut',
    'Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar', 'Shimla',
    'Manali', 'Dharamshala', 'Dehradun', 'Haridwar', 'Rishikesh',
    'Mussoorie', 'Nainital', 'Jaipur', 'Jodhpur', 'Udaipur',
    'Ajmer', 'Pushkar', 'Bikaner', 'Jaisalmer', 'Kota',
    'Agartala', 'Jammu',
    'Mumbai', 'Pune', 'Nashik', 'Aurangabad', 'Kolhapur',
    'Nagpur', 'Nanded', 'Solapur', 'Thane', 'Ahmednagar',
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
    'Gandhinagar', 'Junagadh', 'Anand', 'Goa', 'Panaji',
    'Margao', 'Indore', 'Bhopal', 'Gwalior', 'Jabalpur',
    'Ujjain', 'Ratlam',
    'Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum',
    'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem',
    'Tirunelveli', 'Pondicherry', 'Vellore', 'Erode',
    'Hyderabad', 'Warangal', 'Vijayawada', 'Visakhapatnam',
    'Tirupati', 'Guntur', 'Nellore', 'Rajahmundry',
    'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur',
    'Kollam', 'Kannur',
    'Kolkata', 'Howrah', 'Siliguri', 'Asansol', 'Durgapur',
    'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur',
    'Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela',
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro',
    'Guwahati', 'Dibrugarh', 'Shillong', 'Imphal',
    'Raipur', 'Bilaspur', 'Durg', 'Bhilai',
  ];

  filteredFromCities: string[] = [];
  filteredToCities: string[] = [];
  showFromDropdown = false;
  showToDropdown = false;

  searchForm = {
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  };

  newsletterEmail = '';

  popularRoutes = [
    { from: 'Delhi', to: 'Jaipur', duration: '5 hrs', buses: 45, price: 299, emoji: '🏰', popular: true },
    { from: 'Mumbai', to: 'Pune', duration: '3 hrs', buses: 60, price: 199, emoji: '🌊', popular: true },
    { from: 'Bangalore', to: 'Chennai', duration: '6 hrs', buses: 38, price: 349, emoji: '🌴', popular: false },
    { from: 'Delhi', to: 'Agra', duration: '4 hrs', buses: 52, price: 249, emoji: '🕌', popular: true },
    { from: 'Hyderabad', to: 'Bangalore', duration: '8 hrs', buses: 30, price: 499, emoji: '💻', popular: false },
    { from: 'Mumbai', to: 'Goa', duration: '10 hrs', buses: 25, price: 599, emoji: '🏖️', popular: true },
    { from: 'Chennai', to: 'Pondicherry', duration: '3 hrs', buses: 20, price: 149, emoji: '⛵', popular: false },
    { from: 'Jaipur', to: 'Udaipur', duration: '6 hrs', buses: 18, price: 399, emoji: '🦚', popular: false },
  ];

  features = [
    { icon: '⚡', title: 'Instant Confirmation', desc: 'Get your booking confirmed in seconds.' },
    { icon: '💳', title: 'Secure Payments', desc: '100% secure transactions.' },
    { icon: '🎫', title: 'Easy Cancellation', desc: 'Hassle-free cancellations.' },
    { icon: '📍', title: 'Live Tracking', desc: 'Track your bus in real-time.' },
    { icon: '💺', title: 'Seat Selection', desc: 'Choose your preferred seat.' },
    { icon: '🏷️', title: 'Best Price Guarantee', desc: 'Best deal every time.' },
  ];

  offers = [
    { discount: '20% OFF', code: 'FIRST20', desc: 'Valid for new users.' },
    { discount: '₹150 OFF', code: 'BUSGO150', desc: 'Bookings above ₹599.' },
    { discount: '15% CASHBACK', code: 'PAY15', desc: 'UPI cashback.' },
  ];

  testimonials = [
    { name: 'Priya Sharma', route: 'Delhi → Jaipur', review: 'Super easy booking experience!' },
    { name: 'Rahul Mehta', route: 'Mumbai → Pune', review: 'Best bus booking app!' },
    { name: 'Anita Singh', route: 'Bangalore → Chennai', review: 'Seat selection feature is fantastic.' },
  ];

  aboutPoints = [
    { icon: '🎯', title: 'Our Mission', desc: 'Make bus travel simple.' },
    { icon: '👁️', title: 'Our Vision', desc: 'Become India\'s most loved platform.' },
    { icon: '💡', title: 'Our Values', desc: 'Transparency and reliability.' },
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('lastFrom');
    localStorage.removeItem('lastTo');
    localStorage.removeItem('lastDate');
  }

  searchBuses() {
    if (!this.searchForm.from || !this.searchForm.to || !this.searchForm.date) {
      alert('Please fill all search fields!');
      return;
    }

    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('lastFrom', this.searchForm.from);
    localStorage.setItem('lastTo',   this.searchForm.to);
    localStorage.setItem('lastDate', this.searchForm.date);

    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token   = localStorage.getItem('token') || sessionStorage.getItem('token');

    let isLoggedIn = false;
    try {
      if (userStr && token) {
        const user = JSON.parse(userStr);
        if (user && user.email) isLoggedIn = true;
      }
    } catch (e) {}

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/bus-list'], {
        queryParams: {
          from: this.searchForm.from,
          to:   this.searchForm.to,
          date: this.searchForm.date
        }
      });
    }
  }

  filterCities(field: 'from' | 'to') {
    const val = field === 'from' ? this.searchForm.from : this.searchForm.to;
    const filtered = this.cities.filter(c =>
      c.toLowerCase().includes(val.toLowerCase())
    );
    if (field === 'from') {
      this.filteredFromCities = filtered;
      this.showFromDropdown = true;
    } else {
      this.filteredToCities = filtered;
      this.showToDropdown = true;
    }
  }

  showDropdown(field: 'from' | 'to') {
    if (field === 'from') {
      this.filteredFromCities = this.cities;
      this.showFromDropdown = true;
      this.showToDropdown = false;
    } else {
      this.filteredToCities = this.cities;
      this.showToDropdown = true;
      this.showFromDropdown = false;
    }
  }

  selectCity(field: 'from' | 'to', city: string) {
    if (field === 'from') {
      this.searchForm.from = city;
      this.showFromDropdown = false;
    } else {
      this.searchForm.to = city;
      this.showToDropdown = false;
    }
  }

  closeDropdowns() {
    this.showFromDropdown = false;
    this.showToDropdown = false;
  }

  swapCities() {
    const temp = this.searchForm.from;
    this.searchForm.from = this.searchForm.to;
    this.searchForm.to = temp;
  }

  quickSearch(route: any) {
    this.searchForm.from = route.from;
    this.searchForm.to   = route.to;
    this.searchBuses();
  }

  subscribeNewsletter() {
    if (!this.newsletterEmail) {
      alert('Please enter your email!');
      return;
    }
    alert('Subscribed successfully!');
    this.newsletterEmail = '';
  }

  scrollToSearch() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}