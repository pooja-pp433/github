import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {

  baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  login(data:any){
    return this.http.post(this.baseUrl + "/login", data);
  }

  header(){
    return {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem("token") || ""
      })
    };
  }

  getBus(){
    return this.http.get(this.baseUrl + "/bus", this.header());
  }

  addBus(data:any){
    return this.http.post(this.baseUrl + "/bus", data, this.header());
  }

  updateBus(id:any,data:any){
    return this.http.put(this.baseUrl + "/bus/"+id, data, this.header());
  }

  deleteBus(id:any){
    return this.http.delete(this.baseUrl + "/bus/"+id, this.header());
  }
}