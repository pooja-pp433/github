const mongoose = require('mongoose');
require('dotenv').config();
const Bus = require('./models/bus');

const buses = [
  // ─── DELHI ROUTES ───────────────────────────────────
  { name: 'Rajdhani Express', operator: 'Rajdhani Travels', type: 'AC Sleeper', from: 'Delhi', to: 'Jaipur', departure: '06:00', arrival: '11:00', price: 699, seats: 12, rating: 4.5 },
  { name: 'Royal Cruiser', operator: 'Royal Travels', type: 'Non-AC Seater', from: 'Delhi', to: 'Jaipur', departure: '08:30', arrival: '13:30', price: 399, seats: 24, rating: 4.2 },
  { name: 'Volvo Gold', operator: 'Gold Travels', type: 'AC Volvo', from: 'Delhi', to: 'Jaipur', departure: '10:00', arrival: '15:00', price: 899, seats: 20, rating: 4.8 },
  { name: 'Budget Express', operator: 'Budget Travels', type: 'Non-AC Seater', from: 'Delhi', to: 'Jaipur', departure: '05:30', arrival: '10:30', price: 299, seats: 30, rating: 3.9 },
  { name: 'Pink City Deluxe', operator: 'Pink City Travels', type: 'AC Semi-Sleeper', from: 'Delhi', to: 'Jaipur', departure: '22:00', arrival: '03:00', price: 599, seats: 18, rating: 4.4 },

  { name: 'Taj Express', operator: 'Star Travels', type: 'AC Seater', from: 'Delhi', to: 'Agra', departure: '07:00', arrival: '11:00', price: 349, seats: 18, rating: 4.3 },
  { name: 'Taj Volvo', operator: 'Taj Travels', type: 'AC Volvo', from: 'Delhi', to: 'Agra', departure: '09:00', arrival: '13:00', price: 549, seats: 22, rating: 4.6 },
  { name: 'Agra Budget', operator: 'Budget Bus', type: 'Non-AC Seater', from: 'Delhi', to: 'Agra', departure: '06:00', arrival: '10:30', price: 199, seats: 35, rating: 3.8 },

  { name: 'Mumbai Night Rider', operator: 'Queen Travels', type: 'AC Semi-Sleeper', from: 'Delhi', to: 'Mumbai', departure: '18:00', arrival: '08:00', price: 1299, seats: 8, rating: 4.7 },
  { name: 'Mumbai Express', operator: 'Express Travels', type: 'AC Sleeper', from: 'Delhi', to: 'Mumbai', departure: '20:00', arrival: '10:00', price: 999, seats: 15, rating: 4.4 },

  { name: 'Lucknow Shatabdi', operator: 'Shatabdi Travels', type: 'AC Seater', from: 'Delhi', to: 'Lucknow', departure: '06:00', arrival: '12:00', price: 449, seats: 25, rating: 4.5 },
  { name: 'Lucknow Express', operator: 'UP Travels', type: 'Non-AC Seater', from: 'Delhi', to: 'Lucknow', departure: '08:00', arrival: '14:30', price: 299, seats: 35, rating: 4.0 },
  { name: 'Lucknow Volvo', operator: 'Volvo Travels', type: 'AC Volvo', from: 'Delhi', to: 'Lucknow', departure: '22:00', arrival: '04:00', price: 649, seats: 20, rating: 4.6 },

  { name: 'Chandigarh AC', operator: 'Punjab Travels', type: 'AC Seater', from: 'Delhi', to: 'Chandigarh', departure: '06:00', arrival: '10:00', price: 399, seats: 28, rating: 4.4 },
  { name: 'Chandigarh Volvo', operator: 'Volvo Bus', type: 'AC Volvo', from: 'Delhi', to: 'Chandigarh', departure: '08:00', arrival: '12:00', price: 599, seats: 20, rating: 4.7 },
  { name: 'Chandigarh Budget', operator: 'Budget Bus', type: 'Non-AC Seater', from: 'Delhi', to: 'Chandigarh', departure: '07:00', arrival: '11:30', price: 249, seats: 38, rating: 3.9 },

  { name: 'Amritsar Golden', operator: 'Golden Temple Travels', type: 'AC Sleeper', from: 'Delhi', to: 'Amritsar', departure: '21:00', arrival: '05:00', price: 799, seats: 14, rating: 4.6 },
  { name: 'Amritsar Express', operator: 'Punjab Express', type: 'AC Seater', from: 'Delhi', to: 'Amritsar', departure: '07:00', arrival: '14:00', price: 499, seats: 24, rating: 4.3 },

  { name: 'Dehradun Hills', operator: 'Hill Travels', type: 'AC Seater', from: 'Delhi', to: 'Dehradun', departure: '06:30', arrival: '11:00', price: 349, seats: 26, rating: 4.3 },
  { name: 'Dehradun Volvo', operator: 'Volvo Travels', type: 'AC Volvo', from: 'Delhi', to: 'Dehradun', departure: '09:00', arrival: '13:30', price: 549, seats: 20, rating: 4.6 },

  { name: 'Haridwar Pilgrimage', operator: 'Pilgrimage Travels', type: 'AC Seater', from: 'Delhi', to: 'Haridwar', departure: '05:00', arrival: '09:30', price: 299, seats: 30, rating: 4.2 },
  { name: 'Rishikesh Yoga', operator: 'Yoga Travels', type: 'AC Seater', from: 'Delhi', to: 'Rishikesh', departure: '06:00', arrival: '11:00', price: 349, seats: 28, rating: 4.4 },

  { name: 'Shimla Hills Express', operator: 'Himachal Travels', type: 'AC Seater', from: 'Delhi', to: 'Shimla', departure: '07:00', arrival: '14:00', price: 599, seats: 22, rating: 4.5 },
  { name: 'Manali Adventure', operator: 'Adventure Travels', type: 'AC Seater', from: 'Delhi', to: 'Manali', departure: '17:00', arrival: '08:00', price: 899, seats: 18, rating: 4.6 },
  { name: 'Dharamshala Express', operator: 'Himachal Express', type: 'AC Seater', from: 'Delhi', to: 'Dharamshala', departure: '18:00', arrival: '07:00', price: 799, seats: 20, rating: 4.4 },

  { name: 'Jodhpur Royal', operator: 'Royal Travels', type: 'AC Sleeper', from: 'Delhi', to: 'Jodhpur', departure: '20:00', arrival: '06:00', price: 849, seats: 14, rating: 4.5 },
  { name: 'Jodhpur Express', operator: 'Desert Express', type: 'Non-AC Seater', from: 'Delhi', to: 'Jodhpur', departure: '19:00', arrival: '05:30', price: 499, seats: 28, rating: 4.1 },

  { name: 'Varanasi Ganga', operator: 'Ganga Travels', type: 'AC Sleeper', from: 'Delhi', to: 'Varanasi', departure: '19:00', arrival: '07:00', price: 899, seats: 12, rating: 4.5 },
  { name: 'Varanasi Express', operator: 'UP Express', type: 'AC Seater', from: 'Delhi', to: 'Varanasi', departure: '20:00', arrival: '08:00', price: 649, seats: 22, rating: 4.3 },

  // ─── MUMBAI ROUTES ───────────────────────────────────
  { name: 'Pune Shatabdi', operator: 'Shatabdi Travels', type: 'AC Seater', from: 'Mumbai', to: 'Pune', departure: '06:00', arrival: '09:00', price: 299, seats: 30, rating: 4.5 },
  { name: 'Pune Volvo', operator: 'Volvo Travels', type: 'AC Volvo', from: 'Mumbai', to: 'Pune', departure: '08:00', arrival: '11:00', price: 499, seats: 20, rating: 4.7 },
  { name: 'Pune Budget', operator: 'Budget Bus', type: 'Non-AC Seater', from: 'Mumbai', to: 'Pune', departure: '10:00', arrival: '13:30', price: 199, seats: 40, rating: 3.8 },
  { name: 'Pune Night Rider', operator: 'Night Travels', type: 'AC Semi-Sleeper', from: 'Mumbai', to: 'Pune', departure: '22:00', arrival: '01:00', price: 399, seats: 25, rating: 4.4 },

  { name: 'Goa Luxury', operator: 'Goa Travels', type: 'AC Sleeper', from: 'Mumbai', to: 'Goa', departure: '21:00', arrival: '07:00', price: 799, seats: 10, rating: 4.6 },
  { name: 'Goa Express', operator: 'Express Bus', type: 'Non-AC Sleeper', from: 'Mumbai', to: 'Goa', departure: '22:00', arrival: '08:00', price: 499, seats: 20, rating: 4.1 },
  { name: 'Goa Volvo', operator: 'Volvo Travels', type: 'AC Volvo', from: 'Mumbai', to: 'Goa', departure: '20:00', arrival: '06:00', price: 999, seats: 15, rating: 4.8 },

  { name: 'Nashik Pilgrim', operator: 'Pilgrim Travels', type: 'AC Seater', from: 'Mumbai', to: 'Nashik', departure: '06:00', arrival: '09:30', price: 249, seats: 32, rating: 4.2 },
  { name: 'Nashik Express', operator: 'Maharashtra Express', type: 'Non-AC Seater', from: 'Mumbai', to: 'Nashik', departure: '07:00', arrival: '10:30', price: 149, seats: 40, rating: 3.9 },

  { name: 'Nagpur Vidarbha', operator: 'Vidarbha Travels', type: 'AC Sleeper', from: 'Mumbai', to: 'Nagpur', departure: '20:00', arrival: '08:00', price: 899, seats: 14, rating: 4.4 },
  { name: 'Nagpur Express', operator: 'Orange City Travels', type: 'AC Seater', from: 'Mumbai', to: 'Nagpur', departure: '19:00', arrival: '07:00', price: 699, seats: 22, rating: 4.2 },

  { name: 'Aurangabad Heritage', operator: 'Heritage Travels', type: 'AC Seater', from: 'Mumbai', to: 'Aurangabad', departure: '07:00', arrival: '13:00', price: 399, seats: 26, rating: 4.3 },
  { name: 'Surat Gujarat', operator: 'Gujarat Travels', type: 'AC Seater', from: 'Mumbai', to: 'Surat', departure: '06:00', arrival: '10:00', price: 399, seats: 28, rating: 4.3 },
  { name: 'Ahmedabad Volvo', operator: 'Volvo Bus', type: 'AC Volvo', from: 'Mumbai', to: 'Ahmedabad', departure: '21:00', arrival: '07:00', price: 899, seats: 18, rating: 4.6 },
  { name: 'Ahmedabad Express', operator: 'Gujarat Express', type: 'AC Sleeper', from: 'Mumbai', to: 'Ahmedabad', departure: '22:00', arrival: '08:00', price: 699, seats: 20, rating: 4.3 },

  { name: 'Kolhapur Express', operator: 'Kolhapur Travels', type: 'AC Seater', from: 'Mumbai', to: 'Kolhapur', departure: '19:00', arrival: '03:00', price: 499, seats: 24, rating: 4.2 },
  { name: 'Indore Central', operator: 'Central Travels', type: 'AC Sleeper', from: 'Mumbai', to: 'Indore', departure: '18:00', arrival: '06:00', price: 799, seats: 16, rating: 4.4 },

  // ─── BANGALORE ROUTES ───────────────────────────────────
  { name: 'Chennai King', operator: 'King Travels', type: 'AC Sleeper', from: 'Bangalore', to: 'Chennai', departure: '21:30', arrival: '05:30', price: 549, seats: 14, rating: 4.4 },
  { name: 'Chennai Star', operator: 'Star Bus', type: 'AC Seater', from: 'Bangalore', to: 'Chennai', departure: '07:00', arrival: '13:00', price: 399, seats: 25, rating: 4.2 },
  { name: 'Chennai Volvo', operator: 'Volvo Express', type: 'AC Volvo', from: 'Bangalore', to: 'Chennai', departure: '22:00', arrival: '06:00', price: 699, seats: 18, rating: 4.6 },

  { name: 'Hyderabad Deccan', operator: 'Deccan Travels', type: 'AC Volvo', from: 'Bangalore', to: 'Hyderabad', departure: '20:00', arrival: '06:00', price: 699, seats: 18, rating: 4.5 },
  { name: 'Hyderabad Express', operator: 'KA Travels', type: 'AC Sleeper', from: 'Bangalore', to: 'Hyderabad', departure: '21:00', arrival: '07:00', price: 599, seats: 20, rating: 4.3 },

  { name: 'Mysore Palace', operator: 'Palace Travels', type: 'AC Seater', from: 'Bangalore', to: 'Mysore', departure: '06:00', arrival: '09:00', price: 199, seats: 35, rating: 4.5 },
  { name: 'Mysore Volvo', operator: 'Volvo Bus', type: 'AC Volvo', from: 'Bangalore', to: 'Mysore', departure: '08:00', arrival: '11:00', price: 349, seats: 22, rating: 4.7 },
  { name: 'Mysore Budget', operator: 'Budget Bus', type: 'Non-AC Seater', from: 'Bangalore', to: 'Mysore', departure: '07:00', arrival: '10:30', price: 129, seats: 42, rating: 3.8 },

  { name: 'Mangalore Coast', operator: 'Coastal Travels', type: 'AC Sleeper', from: 'Bangalore', to: 'Mangalore', departure: '21:00', arrival: '05:00', price: 599, seats: 16, rating: 4.4 },
  { name: 'Coimbatore Express', operator: 'TN Travels', type: 'AC Seater', from: 'Bangalore', to: 'Coimbatore', departure: '22:00', arrival: '05:00', price: 449, seats: 22, rating: 4.3 },
  { name: 'Kochi Backwaters', operator: 'Kerala Travels', type: 'AC Sleeper', from: 'Bangalore', to: 'Kochi', departure: '20:00', arrival: '06:00', price: 749, seats: 14, rating: 4.5 },
  { name: 'Goa Coastal', operator: 'Coastal Bus', type: 'AC Seater', from: 'Bangalore', to: 'Goa', departure: '19:00', arrival: '07:00', price: 699, seats: 20, rating: 4.3 },
  { name: 'Hubli Express', operator: 'North Karnataka', type: 'AC Seater', from: 'Bangalore', to: 'Hubli', departure: '21:00', arrival: '04:00', price: 449, seats: 24, rating: 4.2 },
  { name: 'Tirupati Pilgrimage', operator: 'Pilgrimage Travels', type: 'AC Seater', from: 'Bangalore', to: 'Tirupati', departure: '22:00', arrival: '05:00', price: 499, seats: 26, rating: 4.4 },
  { name: 'Mumbai Volvo', operator: 'Volvo Travels', type: 'AC Volvo', from: 'Bangalore', to: 'Mumbai', departure: '17:00', arrival: '09:00', price: 1199, seats: 16, rating: 4.6 },

  // ─── CHENNAI ROUTES ───────────────────────────────────
  { name: 'Pondicherry Express', operator: 'Pondy Travels', type: 'AC Seater', from: 'Chennai', to: 'Pondicherry', departure: '06:00', arrival: '09:00', price: 199, seats: 35, rating: 4.3 },
  { name: 'Pondicherry Volvo', operator: 'Luxury Bus', type: 'AC Volvo', from: 'Chennai', to: 'Pondicherry', departure: '08:00', arrival: '11:00', price: 349, seats: 20, rating: 4.6 },
  { name: 'Madurai Meenakshi', operator: 'Meenakshi Travels', type: 'AC Sleeper', from: 'Chennai', to: 'Madurai', departure: '21:00', arrival: '05:00', price: 549, seats: 14, rating: 4.4 },
  { name: 'Madurai Express', operator: 'TN Express', type: 'AC Seater', from: 'Chennai', to: 'Madurai', departure: '22:00', arrival: '06:00', price: 399, seats: 24, rating: 4.2 },
  { name: 'Coimbatore AC', operator: 'Coimbatore Travels', type: 'AC Seater', from: 'Chennai', to: 'Coimbatore', departure: '21:00', arrival: '04:00', price: 449, seats: 22, rating: 4.3 },
  { name: 'Trichy Express', operator: 'Rock Fort Travels', type: 'AC Seater', from: 'Chennai', to: 'Trichy', departure: '22:00', arrival: '04:00', price: 349, seats: 26, rating: 4.2 },
  { name: 'Bangalore Night', operator: 'Southways', type: 'AC Sleeper', from: 'Chennai', to: 'Bangalore', departure: '22:00', arrival: '06:00', price: 549, seats: 16, rating: 4.4 },
  { name: 'Hyderabad Link', operator: 'AP Travels', type: 'AC Sleeper', from: 'Chennai', to: 'Hyderabad', departure: '19:00', arrival: '07:00', price: 699, seats: 14, rating: 4.3 },
  { name: 'Kochi Express', operator: 'Kerala Express', type: 'AC Sleeper', from: 'Chennai', to: 'Kochi', departure: '20:00', arrival: '06:00', price: 649, seats: 16, rating: 4.4 },
  { name: 'Tirupati Express', operator: 'Tirumala Travels', type: 'AC Seater', from: 'Chennai', to: 'Tirupati', departure: '06:00', arrival: '10:00', price: 299, seats: 30, rating: 4.5 },
  { name: 'Vellore Medical', operator: 'Medical Travels', type: 'AC Seater', from: 'Chennai', to: 'Vellore', departure: '07:00', arrival: '10:00', price: 199, seats: 32, rating: 4.1 },

  // ─── HYDERABAD ROUTES ───────────────────────────────────
  { name: 'Bangalore Night Queen', operator: 'Night Travels', type: 'AC Sleeper', from: 'Hyderabad', to: 'Bangalore', departure: '21:00', arrival: '05:00', price: 699, seats: 12, rating: 4.5 },
  { name: 'Bangalore Volvo', operator: 'Volvo Express', type: 'AC Volvo', from: 'Hyderabad', to: 'Bangalore', departure: '22:00', arrival: '06:00', price: 899, seats: 18, rating: 4.7 },
  { name: 'Goa Rider', operator: 'Rider Travels', type: 'AC Semi-Sleeper', from: 'Hyderabad', to: 'Goa', departure: '20:00', arrival: '08:00', price: 899, seats: 16, rating: 4.3 },
  { name: 'Mumbai Deccan', operator: 'Deccan Travels', type: 'AC Sleeper', from: 'Hyderabad', to: 'Mumbai', departure: '18:00', arrival: '08:00', price: 999, seats: 14, rating: 4.4 },
  { name: 'Vijayawada Express', operator: 'AP Travels', type: 'AC Seater', from: 'Hyderabad', to: 'Vijayawada', departure: '06:00', arrival: '11:00', price: 349, seats: 28, rating: 4.2 },
  { name: 'Tirupati Darshan', operator: 'Darshan Travels', type: 'AC Seater', from: 'Hyderabad', to: 'Tirupati', departure: '21:00', arrival: '05:00', price: 499, seats: 24, rating: 4.5 },
  { name: 'Warangal Express', operator: 'Telangana Travels', type: 'Non-AC Seater', from: 'Hyderabad', to: 'Warangal', departure: '07:00', arrival: '10:00', price: 149, seats: 40, rating: 4.0 },
  { name: 'Pune Deccan', operator: 'Deccan Bus', type: 'AC Sleeper', from: 'Hyderabad', to: 'Pune', departure: '20:00', arrival: '06:00', price: 799, seats: 16, rating: 4.3 },
  { name: 'Visakhapatnam Express', operator: 'Vizag Travels', type: 'AC Sleeper', from: 'Hyderabad', to: 'Visakhapatnam', departure: '19:00', arrival: '05:00', price: 749, seats: 14, rating: 4.4 },

  // ─── PUNE ROUTES ───────────────────────────────────
  { name: 'Mumbai Swargate', operator: 'MSRTC', type: 'AC Seater', from: 'Pune', to: 'Mumbai', departure: '06:00', arrival: '09:30', price: 299, seats: 35, rating: 4.3 },
  { name: 'Mumbai Volvo', operator: 'Volvo Travels', type: 'AC Volvo', from: 'Pune', to: 'Mumbai', departure: '08:00', arrival: '11:00', price: 549, seats: 20, rating: 4.7 },
  { name: 'Nashik Pilgrim', operator: 'Pilgrim Travels', type: 'AC Seater', from: 'Pune', to: 'Nashik', departure: '07:00', arrival: '11:00', price: 299, seats: 28, rating: 4.2 },
  { name: 'Goa Pune', operator: 'Goa Travels', type: 'AC Sleeper', from: 'Pune', to: 'Goa', departure: '21:00', arrival: '07:00', price: 699, seats: 14, rating: 4.5 },
  { name: 'Bangalore Deccan', operator: 'Deccan Travels', type: 'AC Sleeper', from: 'Pune', to: 'Bangalore', departure: '17:00', arrival: '07:00', price: 999, seats: 16, rating: 4.4 },
  { name: 'Hyderabad Link', operator: 'AP Express', type: 'AC Sleeper', from: 'Pune', to: 'Hyderabad', departure: '18:00', arrival: '06:00', price: 799, seats: 14, rating: 4.3 },
  { name: 'Kolhapur Express', operator: 'Kolhapur Travels', type: 'AC Seater', from: 'Pune', to: 'Kolhapur', departure: '07:00', arrival: '12:00', price: 349, seats: 26, rating: 4.2 },

  // ─── AHMEDABAD ROUTES ───────────────────────────────────
  { name: 'Mumbai Volvo', operator: 'Gujarat Travels', type: 'AC Sleeper', from: 'Ahmedabad', to: 'Mumbai', departure: '20:00', arrival: '06:00', price: 699, seats: 14, rating: 4.4 },
  { name: 'Surat Express', operator: 'Gujarat Express', type: 'Non-AC Seater', from: 'Ahmedabad', to: 'Surat', departure: '07:00', arrival: '10:00', price: 199, seats: 40, rating: 3.9 },
  { name: 'Surat Volvo', operator: 'Volvo Bus', type: 'AC Volvo', from: 'Ahmedabad', to: 'Surat', departure: '09:00', arrival: '12:00', price: 349, seats: 22, rating: 4.5 },
  { name: 'Jaipur Desert', operator: 'Desert Travels', type: 'AC Sleeper', from: 'Ahmedabad', to: 'Jaipur', departure: '20:00', arrival: '06:00', price: 699, seats: 16, rating: 4.3 },
  { name: 'Vadodara Express', operator: 'Baroda Travels', type: 'AC Seater', from: 'Ahmedabad', to: 'Vadodara', departure: '07:00', arrival: '09:30', price: 199, seats: 30, rating: 4.2 },
  { name: 'Rajkot Saurashtra', operator: 'Saurashtra Travels', type: 'AC Seater', from: 'Ahmedabad', to: 'Rajkot', departure: '08:00', arrival: '12:00', price: 299, seats: 28, rating: 4.1 },
  { name: 'Delhi Gujarat', operator: 'Gujarat Travels', type: 'AC Sleeper', from: 'Ahmedabad', to: 'Delhi', departure: '17:00', arrival: '07:00', price: 999, seats: 14, rating: 4.4 },

  // ─── SURAT ROUTES ───────────────────────────────────
  { name: 'Mumbai Diamond City', operator: 'Diamond Travels', type: 'AC Seater', from: 'Surat', to: 'Mumbai', departure: '06:00', arrival: '10:00', price: 399, seats: 28, rating: 4.3 },
  { name: 'Mumbai Volvo', operator: 'Volvo Bus', type: 'AC Volvo', from: 'Surat', to: 'Mumbai', departure: '08:00', arrival: '12:00', price: 599, seats: 18, rating: 4.6 },
  { name: 'Ahmedabad Link', operator: 'Gujarat Express', type: 'AC Seater', from: 'Surat', to: 'Ahmedabad', departure: '07:00', arrival: '10:00', price: 249, seats: 35, rating: 4.2 },
  { name: 'Pune Surat', operator: 'Maharashtra Travels', type: 'AC Sleeper', from: 'Surat', to: 'Pune', departure: '21:00', arrival: '05:00', price: 699, seats: 16, rating: 4.3 },
  { name: 'Vadodara Express', operator: 'Baroda Bus', type: 'Non-AC Seater', from: 'Surat', to: 'Vadodara', departure: '07:00', arrival: '10:00', price: 149, seats: 38, rating: 3.9 },

  // ─── KOLKATA ROUTES ───────────────────────────────────
  { name: 'Patna Ganga', operator: 'Ganga Travels', type: 'AC Seater', from: 'Kolkata', to: 'Patna', departure: '20:00', arrival: '06:00', price: 599, seats: 22, rating: 4.2 },
  { name: 'Bhubaneswar Kalinga', operator: 'Kalinga Travels', type: 'AC Sleeper', from: 'Kolkata', to: 'Bhubaneswar', departure: '21:00', arrival: '05:00', price: 649, seats: 14, rating: 4.4 },
  { name: 'Bhubaneswar Express', operator: 'Odisha Travels', type: 'AC Seater', from: 'Kolkata', to: 'Bhubaneswar', departure: '22:00', arrival: '06:00', price: 499, seats: 22, rating: 4.2 },
  { name: 'Siliguri Darjeeling', operator: 'Hill Travels', type: 'AC Seater', from: 'Kolkata', to: 'Siliguri', departure: '20:00', arrival: '06:00', price: 599, seats: 20, rating: 4.3 },
  { name: 'Guwahati Express', operator: 'NE Travels', type: 'AC Sleeper', from: 'Kolkata', to: 'Guwahati', departure: '18:00', arrival: '08:00', price: 899, seats: 16, rating: 4.4 },
  { name: 'Dhanbad Industrial', operator: 'Jharkhand Travels', type: 'AC Seater', from: 'Kolkata', to: 'Dhanbad', departure: '07:00', arrival: '11:00', price: 299, seats: 28, rating: 4.0 },
  { name: 'Ranchi Express', operator: 'Jharkhand Express', type: 'AC Sleeper', from: 'Kolkata', to: 'Ranchi', departure: '20:00', arrival: '04:00', price: 549, seats: 16, rating: 4.2 },

  // ─── JAIPUR ROUTES ───────────────────────────────────
  { name: 'Udaipur Royal', operator: 'Royal Bus', type: 'AC Seater', from: 'Jaipur', to: 'Udaipur', departure: '07:00', arrival: '13:00', price: 449, seats: 22, rating: 4.4 },
  { name: 'Udaipur Non-AC', operator: 'Express Travels', type: 'Non-AC Seater', from: 'Jaipur', to: 'Udaipur', departure: '09:00', arrival: '15:00', price: 299, seats: 32, rating: 4.0 },
  { name: 'Jodhpur Blue City', operator: 'Blue City Travels', type: 'AC Seater', from: 'Jaipur', to: 'Jodhpur', departure: '07:00', arrival: '12:00', price: 349, seats: 26, rating: 4.3 },
  { name: 'Jodhpur Sleeper', operator: 'Rajputana Travels', type: 'AC Sleeper', from: 'Jaipur', to: 'Jodhpur', departure: '22:00', arrival: '03:00', price: 549, seats: 16, rating: 4.4 },
  { name: 'Ajmer Pushkar', operator: 'Pilgrim Express', type: 'AC Seater', from: 'Jaipur', to: 'Ajmer', departure: '06:00', arrival: '09:00', price: 199, seats: 30, rating: 4.1 },
  { name: 'Bikaner Desert', operator: 'Desert Express', type: 'Non-AC Seater', from: 'Jaipur', to: 'Bikaner', departure: '08:00', arrival: '14:00', price: 299, seats: 36, rating: 3.9 },
  { name: 'Jaisalmer Golden Fort', operator: 'Golden Fort Travels', type: 'AC Sleeper', from: 'Jaipur', to: 'Jaisalmer', departure: '20:00', arrival: '06:00', price: 699, seats: 14, rating: 4.5 },
  { name: 'Kota Industrial', operator: 'Kota Travels', type: 'AC Seater', from: 'Jaipur', to: 'Kota', departure: '07:00', arrival: '12:00', price: 299, seats: 28, rating: 4.1 },
  { name: 'Delhi Pink City', operator: 'Pink City Express', type: 'AC Volvo', from: 'Jaipur', to: 'Delhi', departure: '06:00', arrival: '11:00', price: 699, seats: 20, rating: 4.6 },
  { name: 'Ahmedabad Rajasthan', operator: 'Rajasthan Travels', type: 'AC Sleeper', from: 'Jaipur', to: 'Ahmedabad', departure: '20:00', arrival: '06:00', price: 699, seats: 14, rating: 4.3 },

  // ─── KOCHI ROUTES ───────────────────────────────────
  { name: 'Thiruvananthapuram AC', operator: 'Kerala Travels', type: 'AC Seater', from: 'Kochi', to: 'Thiruvananthapuram', departure: '06:00', arrival: '12:00', price: 349, seats: 26, rating: 4.4 },
  { name: 'Kozhikode Express', operator: 'Malabar Travels', type: 'AC Seater', from: 'Kochi', to: 'Kozhikode', departure: '07:00', arrival: '11:00', price: 249, seats: 30, rating: 4.3 },
  { name: 'Bangalore Volvo', operator: 'Volvo Express', type: 'AC Volvo', from: 'Kochi', to: 'Bangalore', departure: '20:00', arrival: '06:00', price: 799, seats: 18, rating: 4.6 },
  { name: 'Chennai Link', operator: 'TN Travels', type: 'AC Sleeper', from: 'Kochi', to: 'Chennai', departure: '19:00', arrival: '06:00', price: 699, seats: 14, rating: 4.4 },
  { name: 'Coimbatore AC', operator: 'Tamil Express', type: 'AC Seater', from: 'Kochi', to: 'Coimbatore', departure: '07:00', arrival: '11:00', price: 249, seats: 28, rating: 4.2 },
  { name: 'Munnar Hills', operator: 'Hill Express', type: 'AC Seater', from: 'Kochi', to: 'Munnar', departure: '07:00', arrival: '11:00', price: 199, seats: 24, rating: 4.5 },

  // ─── LUCKNOW ROUTES ───────────────────────────────────
  { name: 'Varanasi Ganga', operator: 'Ganga Travels', type: 'AC Seater', from: 'Lucknow', to: 'Varanasi', departure: '07:00', arrival: '12:00', price: 299, seats: 28, rating: 4.3 },
  { name: 'Agra Express', operator: 'UP Express', type: 'AC Seater', from: 'Lucknow', to: 'Agra', departure: '06:00', arrival: '11:00', price: 349, seats: 26, rating: 4.2 },
  { name: 'Delhi Shatabdi', operator: 'UP Travels', type: 'AC Volvo', from: 'Lucknow', to: 'Delhi', departure: '06:00', arrival: '12:00', price: 649, seats: 20, rating: 4.6 },
  { name: 'Kanpur Express', operator: 'UP Bus', type: 'Non-AC Seater', from: 'Lucknow', to: 'Kanpur', departure: '07:00', arrival: '09:00', price: 99, seats: 45, rating: 3.8 },
  { name: 'Ayodhya Pilgrimage', operator: 'Pilgrimage Travels', type: 'AC Seater', from: 'Lucknow', to: 'Ayodhya', departure: '05:00', arrival: '07:00', price: 149, seats: 35, rating: 4.3 },
  { name: 'Gorakhpur Purvanchal', operator: 'Purvanchal Travels', type: 'AC Seater', from: 'Lucknow', to: 'Gorakhpur', departure: '07:00', arrival: '12:00', price: 299, seats: 30, rating: 4.1 },
  { name: 'Prayagraj Triveni', operator: 'Triveni Travels', type: 'AC Seater', from: 'Lucknow', to: 'Prayagraj', departure: '06:00', arrival: '10:00', price: 249, seats: 28, rating: 4.2 },

  // ─── INDORE ROUTES ───────────────────────────────────
  { name: 'Bhopal Express', operator: 'MP Travels', type: 'AC Seater', from: 'Indore', to: 'Bhopal', departure: '06:00', arrival: '09:00', price: 199, seats: 30, rating: 4.2 },
  { name: 'Mumbai Night', operator: 'Night Express', type: 'AC Sleeper', from: 'Indore', to: 'Mumbai', departure: '18:00', arrival: '06:00', price: 799, seats: 16, rating: 4.4 },
  { name: 'Ahmedabad Express', operator: 'Gujarat Travels', type: 'AC Seater', from: 'Indore', to: 'Ahmedabad', departure: '07:00', arrival: '13:00', price: 399, seats: 26, rating: 4.3 },
  { name: 'Delhi Central', operator: 'Central India Travels', type: 'AC Sleeper', from: 'Indore', to: 'Delhi', departure: '19:00', arrival: '07:00', price: 899, seats: 14, rating: 4.4 },
  { name: 'Ujjain Mahakal', operator: 'Mahakal Travels', type: 'Non-AC Seater', from: 'Indore', to: 'Ujjain', departure: '07:00', arrival: '08:30', price: 79, seats: 45, rating: 4.0 },
  { name: 'Jaipur Rajasthan', operator: 'Rajasthan Travels', type: 'AC Sleeper', from: 'Indore', to: 'Jaipur', departure: '20:00', arrival: '06:00', price: 699, seats: 16, rating: 4.3 },

  // ─── PATNA ROUTES ───────────────────────────────────
  { name: 'Varanasi Ganga', operator: 'Ganga Travels', type: 'AC Seater', from: 'Patna', to: 'Varanasi', departure: '06:00', arrival: '10:00', price: 249, seats: 28, rating: 4.2 },
  { name: 'Kolkata Express', operator: 'Bengal Travels', type: 'AC Sleeper', from: 'Patna', to: 'Kolkata', departure: '20:00', arrival: '06:00', price: 599, seats: 16, rating: 4.3 },
  { name: 'Ranchi Jharkhand', operator: 'Jharkhand Travels', type: 'AC Seater', from: 'Patna', to: 'Ranchi', departure: '07:00', arrival: '13:00', price: 349, seats: 24, rating: 4.1 },
  { name: 'Gaya Bodh', operator: 'Bodh Travels', type: 'AC Seater', from: 'Patna', to: 'Gaya', departure: '06:00', arrival: '09:00', price: 199, seats: 30, rating: 4.2 },
  { name: 'Delhi Patna', operator: 'Bihar Travels', type: 'AC Sleeper', from: 'Patna', to: 'Delhi', departure: '19:00', arrival: '09:00', price: 999, seats: 14, rating: 4.3 },

  // ─── BHUBANESWAR ROUTES ───────────────────────────────────
  { name: 'Puri Jagannath', operator: 'Jagannath Travels', type: 'AC Seater', from: 'Bhubaneswar', to: 'Puri', departure: '06:00', arrival: '08:00', price: 149, seats: 35, rating: 4.4 },
  { name: 'Kolkata Odisha', operator: 'Odisha Travels', type: 'AC Sleeper', from: 'Bhubaneswar', to: 'Kolkata', departure: '20:00', arrival: '05:00', price: 649, seats: 16, rating: 4.3 },
  { name: 'Cuttack Express', operator: 'Utkal Travels', type: 'Non-AC Seater', from: 'Bhubaneswar', to: 'Cuttack', departure: '07:00', arrival: '08:00', price: 79, seats: 45, rating: 4.0 },
  { name: 'Rourkela Steel', operator: 'Steel City Travels', type: 'AC Seater', from: 'Bhubaneswar', to: 'Rourkela', departure: '07:00', arrival: '13:00', price: 349, seats: 26, rating: 4.1 },
  { name: 'Vizag Express', operator: 'Vizag Travels', type: 'AC Seater', from: 'Bhubaneswar', to: 'Visakhapatnam', departure: '20:00', arrival: '05:00', price: 549, seats: 20, rating: 4.2 },

  // ─── GUWAHATI ROUTES ───────────────────────────────────
  { name: 'Shillong Express', operator: 'Meghalaya Travels', type: 'AC Seater', from: 'Guwahati', to: 'Shillong', departure: '07:00', arrival: '10:00', price: 199, seats: 28, rating: 4.3 },
  { name: 'Dibrugarh Express', operator: 'Assam Travels', type: 'AC Seater', from: 'Guwahati', to: 'Dibrugarh', departure: '06:00', arrival: '14:00', price: 449, seats: 24, rating: 4.2 },
  { name: 'Siliguri Link', operator: 'NE Travels', type: 'AC Sleeper', from: 'Guwahati', to: 'Siliguri', departure: '20:00', arrival: '04:00', price: 549, seats: 18, rating: 4.2 },
  { name: 'Kolkata NE Express', operator: 'NE Express', type: 'AC Sleeper', from: 'Guwahati', to: 'Kolkata', departure: '17:00', arrival: '09:00', price: 899, seats: 14, rating: 4.3 },

  // ─── VISAKHAPATNAM ROUTES ───────────────────────────────────
  { name: 'Hyderabad Link', operator: 'AP Travels', type: 'AC Sleeper', from: 'Visakhapatnam', to: 'Hyderabad', departure: '19:00', arrival: '05:00', price: 749, seats: 14, rating: 4.4 },
  { name: 'Vijayawada Express', operator: 'AP Express', type: 'AC Seater', from: 'Visakhapatnam', to: 'Vijayawada', departure: '07:00', arrival: '13:00', price: 399, seats: 24, rating: 4.2 },
  { name: 'Bhubaneswar Coastal', operator: 'Coastal Travels', type: 'AC Seater', from: 'Visakhapatnam', to: 'Bhubaneswar', departure: '20:00', arrival: '05:00', price: 549, seats: 20, rating: 4.3 },

  // ─── NAGPUR ROUTES ───────────────────────────────────
  { name: 'Mumbai Orange City', operator: 'Orange City Travels', type: 'AC Sleeper', from: 'Nagpur', to: 'Mumbai', departure: '19:00', arrival: '07:00', price: 899, seats: 14, rating: 4.4 },
  { name: 'Hyderabad Link', operator: 'Deccan Travels', type: 'AC Sleeper', from: 'Nagpur', to: 'Hyderabad', departure: '20:00', arrival: '06:00', price: 699, seats: 16, rating: 4.3 },
  { name: 'Raipur Express', operator: 'Chhattisgarh Travels', type: 'AC Seater', from: 'Nagpur', to: 'Raipur', departure: '07:00', arrival: '13:00', price: 349, seats: 26, rating: 4.1 },

  // ─── THIRUVANANTHAPURAM ROUTES ───────────────────────────────────
  { name: 'Kochi Backwaters', operator: 'Kerala Express', type: 'AC Seater', from: 'Thiruvananthapuram', to: 'Kochi', departure: '07:00', arrival: '13:00', price: 349, seats: 28, rating: 4.4 },
  { name: 'Bangalore Night', operator: 'KA Travels', type: 'AC Sleeper', from: 'Thiruvananthapuram', to: 'Bangalore', departure: '19:00', arrival: '07:00', price: 849, seats: 14, rating: 4.5 },
  { name: 'Coimbatore Express', operator: 'Tamil Travels', type: 'AC Seater', from: 'Thiruvananthapuram', to: 'Coimbatore', departure: '06:00', arrival: '11:00', price: 299, seats: 26, rating: 4.2 },
  { name: 'Chennai Link', operator: 'South India Travels', type: 'AC Sleeper', from: 'Thiruvananthapuram', to: 'Chennai', departure: '18:00', arrival: '06:00', price: 749, seats: 14, rating: 4.4 },

  // ─── DELHI NCR ROUTES ───────────────────────────────────
  { name: 'Gurgaon Express', operator: 'NCR Travels', type: 'AC Seater', from: 'Delhi', to: 'Gurgaon', departure: '07:00', arrival: '08:30', price: 149, seats: 35, rating: 4.2 },
  { name: 'Gurgaon Volvo', operator: 'Volvo Bus', type: 'AC Volvo', from: 'Delhi', to: 'Gurgaon', departure: '09:00', arrival: '10:30', price: 249, seats: 22, rating: 4.5 },
  { name: 'Gurgaon Budget', operator: 'Budget Bus', type: 'Non-AC Seater', from: 'Delhi', to: 'Gurgaon', departure: '06:00', arrival: '07:30', price: 99, seats: 45, rating: 3.8 },
  { name: 'Noida Express', operator: 'NCR Travels', type: 'AC Seater', from: 'Delhi', to: 'Noida', departure: '07:00', arrival: '08:00', price: 99, seats: 40, rating: 4.1 },
  { name: 'Faridabad Link', operator: 'Haryana Travels', type: 'AC Seater', from: 'Delhi', to: 'Faridabad', departure: '06:30', arrival: '07:30', price: 99, seats: 38, rating: 4.0 },
  { name: 'Ghaziabad Express', operator: 'UP Travels', type: 'Non-AC Seater', from: 'Delhi', to: 'Ghaziabad', departure: '07:00', arrival: '08:00', price: 79, seats: 45, rating: 3.9 },
  { name: 'Meerut Fast', operator: 'UP Express', type: 'AC Seater', from: 'Delhi', to: 'Meerut', departure: '06:00', arrival: '08:30', price: 199, seats: 30, rating: 4.2 },
  { name: 'Mathura Pilgrim', operator: 'Pilgrim Travels', type: 'AC Seater', from: 'Delhi', to: 'Mathura', departure: '06:00', arrival: '09:00', price: 199, seats: 28, rating: 4.3 },
  { name: 'Vrindavan Express', operator: 'Braj Travels', type: 'AC Seater', from: 'Delhi', to: 'Vrindavan', departure: '06:00', arrival: '09:30', price: 219, seats: 26, rating: 4.4 },

  // ─── GURGAON ROUTES ───────────────────────────────────
  { name: 'Delhi Express', operator: 'NCR Travels', type: 'AC Seater', from: 'Gurgaon', to: 'Delhi', departure: '08:00', arrival: '09:30', price: 149, seats: 35, rating: 4.2 },
  { name: 'Jaipur Millennium', operator: 'Millennium Travels', type: 'AC Volvo', from: 'Gurgaon', to: 'Jaipur', departure: '07:00', arrival: '12:00', price: 799, seats: 20, rating: 4.6 },
  { name: 'Chandigarh Link', operator: 'Punjab Travels', type: 'AC Seater', from: 'Gurgaon', to: 'Chandigarh', departure: '08:00', arrival: '12:30', price: 449, seats: 26, rating: 4.3 },

  // ─── NOIDA ROUTES ───────────────────────────────────
  { name: 'Delhi Link', operator: 'NCR Bus', type: 'AC Seater', from: 'Noida', to: 'Delhi', departure: '07:00', arrival: '08:00', price: 99, seats: 40, rating: 4.1 },
  { name: 'Agra Express', operator: 'UP Travels', type: 'AC Seater', from: 'Noida', to: 'Agra', departure: '06:00', arrival: '10:00', price: 299, seats: 28, rating: 4.2 },
  { name: 'Lucknow Volvo', operator: 'Volvo Travels', type: 'AC Volvo', from: 'Noida', to: 'Lucknow', departure: '22:00', arrival: '04:00', price: 649, seats: 20, rating: 4.5 },

  // ─── CHANDIGARH ROUTES ───────────────────────────────────
  { name: 'Amritsar Golden', operator: 'Punjab Travels', type: 'AC Seater', from: 'Chandigarh', to: 'Amritsar', departure: '07:00', arrival: '10:30', price: 299, seats: 28, rating: 4.3 },
  { name: 'Shimla Hills', operator: 'HRTC', type: 'AC Seater', from: 'Chandigarh', to: 'Shimla', departure: '08:00', arrival: '12:00', price: 349, seats: 24, rating: 4.4 },
  { name: 'Delhi Volvo', operator: 'Volvo Express', type: 'AC Volvo', from: 'Chandigarh', to: 'Delhi', departure: '06:00', arrival: '10:00', price: 599, seats: 20, rating: 4.7 },
  { name: 'Manali Adventure', operator: 'Adventure Travels', type: 'AC Seater', from: 'Chandigarh', to: 'Manali', departure: '06:00', arrival: '14:00', price: 699, seats: 20, rating: 4.5 },
  { name: 'Dharamshala Express', operator: 'Himachal Express', type: 'AC Seater', from: 'Chandigarh', to: 'Dharamshala', departure: '07:00', arrival: '13:00', price: 599, seats: 22, rating: 4.4 },

  // ─── AMRITSAR ROUTES ───────────────────────────────────
  { name: 'Delhi Golden Temple', operator: 'Punjab Express', type: 'AC Sleeper', from: 'Amritsar', to: 'Delhi', departure: '21:00', arrival: '05:00', price: 799, seats: 14, rating: 4.6 },
  { name: 'Chandigarh Express', operator: 'Punjab Travels', type: 'AC Seater', from: 'Amritsar', to: 'Chandigarh', departure: '07:00', arrival: '10:30', price: 299, seats: 28, rating: 4.3 },
  { name: 'Ludhiana Link', operator: 'Ludhiana Travels', type: 'Non-AC Seater', from: 'Amritsar', to: 'Ludhiana', departure: '07:00', arrival: '09:30', price: 149, seats: 36, rating: 4.0 },
  { name: 'Jalandhar Express', operator: 'Doaba Travels', type: 'AC Seater', from: 'Amritsar', to: 'Jalandhar', departure: '07:00', arrival: '09:00', price: 149, seats: 30, rating: 4.1 },

  // ─── SHIMLA ROUTES ───────────────────────────────────
  { name: 'Delhi Express', operator: 'HP Travels', type: 'AC Seater', from: 'Shimla', to: 'Delhi', departure: '07:00', arrival: '14:00', price: 599, seats: 22, rating: 4.5 },
  { name: 'Chandigarh Link', operator: 'HRTC', type: 'AC Seater', from: 'Shimla', to: 'Chandigarh', departure: '08:00', arrival: '12:00', price: 349, seats: 24, rating: 4.3 },
  { name: 'Manali Hills', operator: 'Hill Express', type: 'AC Seater', from: 'Shimla', to: 'Manali', departure: '07:00', arrival: '14:00', price: 549, seats: 20, rating: 4.4 },

  // ─── DEHRADUN ROUTES ───────────────────────────────────
  { name: 'Delhi Volvo', operator: 'Volvo Express', type: 'AC Volvo', from: 'Dehradun', to: 'Delhi', departure: '06:00', arrival: '10:30', price: 549, seats: 20, rating: 4.6 },
  { name: 'Haridwar Link', operator: 'Uttarakhand Travels', type: 'Non-AC Seater', from: 'Dehradun', to: 'Haridwar', departure: '07:00', arrival: '08:30', price: 99, seats: 40, rating: 4.0 },
  { name: 'Rishikesh Express', operator: 'Ganga Travels', type: 'AC Seater', from: 'Dehradun', to: 'Rishikesh', departure: '07:00', arrival: '09:00', price: 149, seats: 32, rating: 4.2 },
  { name: 'Mussoorie Hills', operator: 'Hill Travels', type: 'AC Seater', from: 'Dehradun', to: 'Mussoorie', departure: '07:00', arrival: '08:30', price: 149, seats: 28, rating: 4.3 },
  { name: 'Nainital Express', operator: 'Kumaon Travels', type: 'AC Seater', from: 'Dehradun', to: 'Nainital', departure: '07:00', arrival: '13:00', price: 399, seats: 24, rating: 4.3 },

  // ─── HARIDWAR / RISHIKESH ROUTES ───────────────────────────────────
  { name: 'Delhi Pilgrimage', operator: 'Pilgrim Bus', type: 'AC Seater', from: 'Haridwar', to: 'Delhi', departure: '06:00', arrival: '10:30', price: 299, seats: 30, rating: 4.2 },
  { name: 'Rishikesh Yoga Express', operator: 'Yoga Travels', type: 'Non-AC Seater', from: 'Haridwar', to: 'Rishikesh', departure: '07:00', arrival: '08:00', price: 79, seats: 40, rating: 4.0 },
  { name: 'Delhi Ganga', operator: 'Ganga Travels', type: 'AC Seater', from: 'Rishikesh', to: 'Delhi', departure: '06:00', arrival: '11:00', price: 349, seats: 28, rating: 4.3 },
  { name: 'Dehradun Link', operator: 'Uttarakhand Bus', type: 'AC Seater', from: 'Rishikesh', to: 'Dehradun', departure: '08:00', arrival: '10:00', price: 149, seats: 30, rating: 4.1 },

  // ─── JODHPUR ROUTES ───────────────────────────────────
  { name: 'Delhi Blue City', operator: 'Rajasthan Travels', type: 'AC Sleeper', from: 'Jodhpur', to: 'Delhi', departure: '18:00', arrival: '06:00', price: 849, seats: 14, rating: 4.5 },
  { name: 'Jaipur Express', operator: 'Pink City Travels', type: 'AC Seater', from: 'Jodhpur', to: 'Jaipur', departure: '07:00', arrival: '12:00', price: 349, seats: 26, rating: 4.3 },
  { name: 'Udaipur Royal', operator: 'Royal Travels', type: 'AC Seater', from: 'Jodhpur', to: 'Udaipur', departure: '08:00', arrival: '13:00', price: 399, seats: 24, rating: 4.4 },
  { name: 'Jaisalmer Desert', operator: 'Desert Travels', type: 'Non-AC Seater', from: 'Jodhpur', to: 'Jaisalmer', departure: '07:00', arrival: '13:00', price: 299, seats: 32, rating: 4.1 },
  { name: 'Ahmedabad Express', operator: 'Gujarat Express', type: 'AC Seater', from: 'Jodhpur', to: 'Ahmedabad', departure: '20:00', arrival: '06:00', price: 599, seats: 20, rating: 4.3 },

  // ─── UDAIPUR ROUTES ───────────────────────────────────
  { name: 'Jaipur Lake City', operator: 'Rajasthan Express', type: 'AC Seater', from: 'Udaipur', to: 'Jaipur', departure: '07:00', arrival: '13:00', price: 449, seats: 22, rating: 4.4 },
  { name: 'Ahmedabad Link', operator: 'Gujarat Travels', type: 'AC Seater', from: 'Udaipur', to: 'Ahmedabad', departure: '07:00', arrival: '13:00', price: 399, seats: 24, rating: 4.3 },
  { name: 'Jodhpur Express', operator: 'Blue City Travels', type: 'AC Seater', from: 'Udaipur', to: 'Jodhpur', departure: '08:00', arrival: '13:00', price: 399, seats: 24, rating: 4.3 },
  { name: 'Delhi Overnight', operator: 'Rajputana Travels', type: 'AC Sleeper', from: 'Udaipur', to: 'Delhi', departure: '20:00', arrival: '08:00', price: 999, seats: 14, rating: 4.5 },
  { name: 'Mumbai Express', operator: 'Western Travels', type: 'AC Sleeper', from: 'Udaipur', to: 'Mumbai', departure: '19:00', arrival: '09:00', price: 999, seats: 14, rating: 4.4 },

  // ─── VARANASI ROUTES ───────────────────────────────────
  { name: 'Delhi Express', operator: 'UP Travels', type: 'AC Sleeper', from: 'Varanasi', to: 'Delhi', departure: '18:00', arrival: '06:00', price: 899, seats: 14, rating: 4.5 },
  { name: 'Lucknow Ganga', operator: 'Ganga Travels', type: 'AC Seater', from: 'Varanasi', to: 'Lucknow', departure: '07:00', arrival: '12:00', price: 299, seats: 28, rating: 4.3 },
  { name: 'Patna Express', operator: 'Bihar Express', type: 'AC Seater', from: 'Varanasi', to: 'Patna', departure: '07:00', arrival: '11:00', price: 249, seats: 30, rating: 4.2 },
  { name: 'Prayagraj Link', operator: 'Triveni Travels', type: 'Non-AC Seater', from: 'Varanasi', to: 'Prayagraj', departure: '07:00', arrival: '09:30', price: 149, seats: 38, rating: 4.0 },
  { name: 'Agra Express', operator: 'UP Express', type: 'AC Seater', from: 'Varanasi', to: 'Agra', departure: '20:00', arrival: '04:00', price: 499, seats: 24, rating: 4.3 },
  { name: 'Kolkata Ganga', operator: 'Bengal Travels', type: 'AC Sleeper', from: 'Varanasi', to: 'Kolkata', departure: '19:00', arrival: '07:00', price: 799, seats: 14, rating: 4.4 },

  // ─── MYSORE ROUTES ───────────────────────────────────
  { name: 'Bangalore City', operator: 'KA Travels', type: 'AC Seater', from: 'Mysore', to: 'Bangalore', departure: '06:00', arrival: '09:00', price: 199, seats: 35, rating: 4.5 },
  { name: 'Bangalore Volvo', operator: 'Volvo Express', type: 'AC Volvo', from: 'Mysore', to: 'Bangalore', departure: '08:00', arrival: '11:00', price: 349, seats: 22, rating: 4.7 },
  { name: 'Ooty Express', operator: 'Nilgiris Travels', type: 'AC Seater', from: 'Mysore', to: 'Ooty', departure: '07:00', arrival: '12:00', price: 299, seats: 24, rating: 4.4 },
  { name: 'Coimbatore Link', operator: 'TN Express', type: 'AC Seater', from: 'Mysore', to: 'Coimbatore', departure: '08:00', arrival: '13:00', price: 349, seats: 26, rating: 4.3 },

  // ─── COIMBATORE ROUTES ───────────────────────────────────
  { name: 'Chennai Express', operator: 'TN Travels', type: 'AC Sleeper', from: 'Coimbatore', to: 'Chennai', departure: '21:00', arrival: '04:00', price: 449, seats: 20, rating: 4.3 },
  { name: 'Bangalore Night', operator: 'KA Travels', type: 'AC Sleeper', from: 'Coimbatore', to: 'Bangalore', departure: '22:00', arrival: '05:00', price: 449, seats: 18, rating: 4.3 },
  { name: 'Kochi Backwaters', operator: 'Kerala Express', type: 'AC Seater', from: 'Coimbatore', to: 'Kochi', departure: '07:00', arrival: '11:00', price: 249, seats: 28, rating: 4.2 },
  { name: 'Madurai Express', operator: 'TN Bus', type: 'AC Seater', from: 'Coimbatore', to: 'Madurai', departure: '07:00', arrival: '11:00', price: 249, seats: 28, rating: 4.1 },
  { name: 'Mysore Link', operator: 'KA Express', type: 'AC Seater', from: 'Coimbatore', to: 'Mysore', departure: '08:00', arrival: '13:00', price: 349, seats: 26, rating: 4.2 },

  // ─── MADURAI ROUTES ───────────────────────────────────
  { name: 'Chennai Express', operator: 'TN Travels', type: 'AC Sleeper', from: 'Madurai', to: 'Chennai', departure: '21:00', arrival: '05:00', price: 549, seats: 14, rating: 4.4 },
  { name: 'Bangalore Night', operator: 'Southways', type: 'AC Sleeper', from: 'Madurai', to: 'Bangalore', departure: '20:00', arrival: '05:00', price: 599, seats: 16, rating: 4.3 },
  { name: 'Coimbatore Express', operator: 'TN Bus', type: 'AC Seater', from: 'Madurai', to: 'Coimbatore', departure: '07:00', arrival: '11:00', price: 249, seats: 28, rating: 4.1 },
  { name: 'Trichy Link', operator: 'Rock Fort Travels', type: 'Non-AC Seater', from: 'Madurai', to: 'Trichy', departure: '07:00', arrival: '10:00', price: 149, seats: 38, rating: 3.9 },
  { name: 'Kochi Express', operator: 'Kerala Travels', type: 'AC Sleeper', from: 'Madurai', to: 'Kochi', departure: '21:00', arrival: '04:00', price: 499, seats: 16, rating: 4.4 },

  // ─── VIJAYAWADA ROUTES ───────────────────────────────────
  { name: 'Hyderabad Express', operator: 'AP Travels', type: 'AC Seater', from: 'Vijayawada', to: 'Hyderabad', departure: '07:00', arrival: '12:00', price: 349, seats: 28, rating: 4.2 },
  { name: 'Chennai Link', operator: 'TN AP Travels', type: 'AC Sleeper', from: 'Vijayawada', to: 'Chennai', departure: '20:00', arrival: '05:00', price: 599, seats: 16, rating: 4.3 },
  { name: 'Vizag Express', operator: 'Vizag Travels', type: 'AC Seater', from: 'Vijayawada', to: 'Visakhapatnam', departure: '07:00', arrival: '13:00', price: 399, seats: 24, rating: 4.2 },
  { name: 'Bangalore Night', operator: 'KA Travels', type: 'AC Sleeper', from: 'Vijayawada', to: 'Bangalore', departure: '20:00', arrival: '06:00', price: 699, seats: 14, rating: 4.3 },

  // ─── TIRUPATI ROUTES ───────────────────────────────────
  { name: 'Chennai Express', operator: 'Tirumala Travels', type: 'AC Seater', from: 'Tirupati', to: 'Chennai', departure: '06:00', arrival: '10:00', price: 299, seats: 30, rating: 4.4 },
  { name: 'Bangalore Darshan', operator: 'Darshan Travels', type: 'AC Seater', from: 'Tirupati', to: 'Bangalore', departure: '06:00', arrival: '12:00', price: 499, seats: 24, rating: 4.5 },
  { name: 'Hyderabad Link', operator: 'AP Express', type: 'AC Sleeper', from: 'Tirupati', to: 'Hyderabad', departure: '21:00', arrival: '05:00', price: 499, seats: 20, rating: 4.3 },

  // ─── RANCHI ROUTES ───────────────────────────────────
  { name: 'Patna Express', operator: 'Jharkhand Express', type: 'AC Seater', from: 'Ranchi', to: 'Patna', departure: '07:00', arrival: '13:00', price: 349, seats: 24, rating: 4.1 },
  { name: 'Kolkata Link', operator: 'Bengal Travels', type: 'AC Sleeper', from: 'Ranchi', to: 'Kolkata', departure: '20:00', arrival: '04:00', price: 549, seats: 16, rating: 4.2 },
  { name: 'Jamshedpur Express', operator: 'Steel City Bus', type: 'Non-AC Seater', from: 'Ranchi', to: 'Jamshedpur', departure: '07:00', arrival: '10:00', price: 149, seats: 38, rating: 3.9 },
  { name: 'Dhanbad Link', operator: 'Jharkhand Bus', type: 'AC Seater', from: 'Ranchi', to: 'Dhanbad', departure: '07:00', arrival: '11:00', price: 249, seats: 28, rating: 4.0 },

  // ─── BHOPAL ROUTES ───────────────────────────────────
  { name: 'Indore Express', operator: 'MP Travels', type: 'AC Seater', from: 'Bhopal', to: 'Indore', departure: '07:00', arrival: '10:00', price: 199, seats: 30, rating: 4.2 },
  { name: 'Delhi Night', operator: 'Central India Travels', type: 'AC Sleeper', from: 'Bhopal', to: 'Delhi', departure: '19:00', arrival: '07:00', price: 899, seats: 14, rating: 4.4 },
  { name: 'Mumbai Express', operator: 'Night Travels', type: 'AC Sleeper', from: 'Bhopal', to: 'Mumbai', departure: '18:00', arrival: '06:00', price: 799, seats: 16, rating: 4.3 },
  { name: 'Nagpur Link', operator: 'Vidarbha Bus', type: 'AC Seater', from: 'Bhopal', to: 'Nagpur', departure: '20:00', arrival: '04:00', price: 499, seats: 22, rating: 4.2 },
  { name: 'Jabalpur Express', operator: 'MP Express', type: 'Non-AC Seater', from: 'Bhopal', to: 'Jabalpur', departure: '07:00', arrival: '12:00', price: 199, seats: 36, rating: 3.9 },
  { name: 'Ujjain Mahakal', operator: 'Mahakal Travels', type: 'AC Seater', from: 'Bhopal', to: 'Ujjain', departure: '07:00', arrival: '10:30', price: 199, seats: 28, rating: 4.1 },

  // ─── VADODARA ROUTES ───────────────────────────────────
  { name: 'Ahmedabad Express', operator: 'Gujarat Express', type: 'AC Seater', from: 'Vadodara', to: 'Ahmedabad', departure: '07:00', arrival: '09:30', price: 199, seats: 30, rating: 4.2 },
  { name: 'Surat Link', operator: 'Surat Travels', type: 'AC Seater', from: 'Vadodara', to: 'Surat', departure: '08:00', arrival: '11:00', price: 199, seats: 28, rating: 4.1 },
  { name: 'Mumbai Night', operator: 'Mumbai Travels', type: 'AC Sleeper', from: 'Vadodara', to: 'Mumbai', departure: '20:00', arrival: '04:00', price: 599, seats: 16, rating: 4.3 },

  // ─── KOZHIKODE ROUTES ───────────────────────────────────
  { name: 'Kochi Malabar', operator: 'Malabar Travels', type: 'AC Seater', from: 'Kozhikode', to: 'Kochi', departure: '07:00', arrival: '11:00', price: 249, seats: 30, rating: 4.3 },
  { name: 'Bangalore Night', operator: 'KA Express', type: 'AC Sleeper', from: 'Kozhikode', to: 'Bangalore', departure: '20:00', arrival: '06:00', price: 749, seats: 14, rating: 4.5 },
  { name: 'Chennai Express', operator: 'South India Travels', type: 'AC Sleeper', from: 'Kozhikode', to: 'Chennai', departure: '19:00', arrival: '07:00', price: 799, seats: 14, rating: 4.4 },
  { name: 'Thiruvananthapuram Link', operator: 'Kerala Travels', type: 'AC Seater', from: 'Kozhikode', to: 'Thiruvananthapuram', departure: '07:00', arrival: '14:00', price: 399, seats: 26, rating: 4.3 },

  // ─── RAIPUR ROUTES ───────────────────────────────────
  { name: 'Nagpur Express', operator: 'CG Travels', type: 'AC Seater', from: 'Raipur', to: 'Nagpur', departure: '07:00', arrival: '13:00', price: 349, seats: 26, rating: 4.1 },
  { name: 'Bhopal Link', operator: 'MP CG Express', type: 'AC Sleeper', from: 'Raipur', to: 'Bhopal', departure: '20:00', arrival: '04:00', price: 549, seats: 16, rating: 4.2 },
  { name: 'Kolkata Express', operator: 'Eastern Travels', type: 'AC Sleeper', from: 'Raipur', to: 'Kolkata', departure: '19:00', arrival: '07:00', price: 799, seats: 14, rating: 4.3 },
  { name: 'Bilaspur Link', operator: 'CG Bus', type: 'Non-AC Seater', from: 'Raipur', to: 'Bilaspur', departure: '07:00', arrival: '10:00', price: 149, seats: 40, rating: 3.9 },

  // ─── MANGALORE ROUTES ───────────────────────────────────
  { name: 'Bangalore Coast', operator: 'Coastal Travels', type: 'AC Sleeper', from: 'Mangalore', to: 'Bangalore', departure: '21:00', arrival: '05:00', price: 599, seats: 16, rating: 4.4 },
  { name: 'Goa Coastal', operator: 'Goa Travels', type: 'AC Seater', from: 'Mangalore', to: 'Goa', departure: '07:00', arrival: '13:00', price: 399, seats: 24, rating: 4.3 },
  { name: 'Mumbai Coastal', operator: 'Konkan Travels', type: 'AC Sleeper', from: 'Mangalore', to: 'Mumbai', departure: '17:00', arrival: '07:00', price: 999, seats: 14, rating: 4.4 },
  { name: 'Kochi Express', operator: 'Kerala Travels', type: 'AC Seater', from: 'Mangalore', to: 'Kochi', departure: '08:00', arrival: '14:00', price: 449, seats: 22, rating: 4.3 },

  // ─── SILIGURI ROUTES ───────────────────────────────────
  { name: 'Kolkata Express', operator: 'Bengal Travels', type: 'AC Sleeper', from: 'Siliguri', to: 'Kolkata', departure: '20:00', arrival: '06:00', price: 599, seats: 16, rating: 4.3 },
  { name: 'Guwahati Link', operator: 'NE Travels', type: 'AC Seater', from: 'Siliguri', to: 'Guwahati', departure: '07:00', arrival: '15:00', price: 549, seats: 22, rating: 4.2 },
  { name: 'Darjeeling Hills', operator: 'Hill Express', type: 'Non-AC Seater', from: 'Siliguri', to: 'Darjeeling', departure: '07:00', arrival: '11:00', price: 199, seats: 28, rating: 4.3 },

  // ─── PURI ROUTES ───────────────────────────────────
  { name: 'Bhubaneswar Express', operator: 'Odisha Travels', type: 'AC Seater', from: 'Puri', to: 'Bhubaneswar', departure: '07:00', arrival: '09:00', price: 149, seats: 35, rating: 4.3 },
  { name: 'Kolkata Jagannath', operator: 'Jagannath Express', type: 'AC Sleeper', from: 'Puri', to: 'Kolkata', departure: '20:00', arrival: '06:00', price: 699, seats: 14, rating: 4.4 },

  // ─── JAMSHEDPUR ROUTES ───────────────────────────────────
  { name: 'Kolkata Steel', operator: 'Steel City Travels', type: 'AC Seater', from: 'Jamshedpur', to: 'Kolkata', departure: '07:00', arrival: '12:00', price: 349, seats: 26, rating: 4.2 },
  { name: 'Ranchi Express', operator: 'Jharkhand Travels', type: 'Non-AC Seater', from: 'Jamshedpur', to: 'Ranchi', departure: '07:00', arrival: '10:00', price: 149, seats: 38, rating: 3.9 },
  { name: 'Patna Link', operator: 'Bihar Express', type: 'AC Seater', from: 'Jamshedpur', to: 'Patna', departure: '20:00', arrival: '04:00', price: 399, seats: 24, rating: 4.1 },

  // ─── SHILLONG ROUTES ───────────────────────────────────
  { name: 'Guwahati Express', operator: 'NE Travels', type: 'AC Seater', from: 'Shillong', to: 'Guwahati', departure: '07:00', arrival: '10:00', price: 199, seats: 28, rating: 4.3 },
  { name: 'Dibrugarh Link', operator: 'Assam Travels', type: 'AC Sleeper', from: 'Shillong', to: 'Dibrugarh', departure: '20:00', arrival: '08:00', price: 699, seats: 16, rating: 4.2 },

  // ─── AGRA ROUTES ───────────────────────────────────
  { name: 'Delhi Taj', operator: 'Taj Travels', type: 'AC Volvo', from: 'Agra', to: 'Delhi', departure: '06:00', arrival: '10:00', price: 549, seats: 20, rating: 4.6 },
  { name: 'Jaipur Express', operator: 'Rajasthan Travels', type: 'AC Seater', from: 'Agra', to: 'Jaipur', departure: '07:00', arrival: '12:00', price: 349, seats: 26, rating: 4.3 },
  { name: 'Lucknow Link', operator: 'UP Travels', type: 'AC Seater', from: 'Agra', to: 'Lucknow', departure: '08:00', arrival: '13:00', price: 349, seats: 26, rating: 4.2 },
  { name: 'Mathura Express', operator: 'Braj Travels', type: 'Non-AC Seater', from: 'Agra', to: 'Mathura', departure: '07:00', arrival: '08:30', price: 79, seats: 40, rating: 4.0 },
  { name: 'Varanasi Express', operator: 'UP Express', type: 'AC Sleeper', from: 'Agra', to: 'Varanasi', departure: '20:00', arrival: '04:00', price: 499, seats: 22, rating: 4.3 },
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    await Bus.deleteMany({});
    console.log('🗑️  Old data deleted');
    await Bus.insertMany(buses);
    console.log(`✅ ${buses.length} buses added successfully!`);
    await mongoose.disconnect();
    console.log('✅ Done! Database seeded.');
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

seedData();