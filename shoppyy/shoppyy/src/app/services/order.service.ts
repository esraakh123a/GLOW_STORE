import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:5000/api/order';

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      orderData
    );
  }

  getMyOrders(): Observable<any> {
    return this.http.get<any>(
      this.apiUrl
    );
  }
}

