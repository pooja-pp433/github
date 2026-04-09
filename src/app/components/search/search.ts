import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit{
  http = inject(HttpClient);

  locationList:any[]=[];


  ngOnInit(): void {
    debugger;
   this.getAllLocations(); 
  }

  getAllLocations(){
    debugger;
    this.http.get("https://api.freeprojectapi.com/api/BusBooking/GetBusLocations").subscribe((res:any)=>{
      debugger;
      this.locationList = res;
    })
  }


}
