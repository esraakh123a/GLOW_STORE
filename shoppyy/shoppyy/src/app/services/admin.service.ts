
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:5000/api/admin';

  private userApiUrl = 'http://localhost:5000/api/user';

  private contactApiUrl = 'http://localhost:5000/api/contact';

  private productApiUrl = 'http://localhost:5000/api/products';

  private orderApiUrl = 'http://localhost:5000/api/order';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  getDashboardStats(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/dashboard`
    );

  }


  // ==========================================
  // RECENT ORDERS
  // ==========================================

  getRecentOrders(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/recent-orders`
    );

  }


  // ==========================================
  // SALES OVERVIEW
  // ==========================================

  getSalesOverview(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/sales-overview`
    );

  }


  // ==========================================
  // CUSTOMERS
  // ==========================================

  getCustomers(): Observable<any> {

    return this.http.get(
      `${this.userApiUrl}/admin/all`
    );

  }


  // ==========================================
  // MESSAGES
  // ==========================================

  // Get All Messages - Admin

  getMessages(): Observable<any> {

    return this.http.get(
      `${this.contactApiUrl}/admin/all`
    );

  }


  // Get Message By ID - Admin

  getMessageById(
    id: string
  ): Observable<any> {

    return this.http.get(
      `${this.contactApiUrl}/admin/${id}`
    );

  }


  // Mark Message As Read - Admin

  markMessageAsRead(
    id: string
  ): Observable<any> {

    return this.http.put(
      `${this.contactApiUrl}/admin/${id}/read`,
      {}
    );

  }


  // ==========================================
  // PRODUCTS
  // ==========================================

  // ------------------------------------------
  // Get All Products
  // ------------------------------------------

  getProducts(): Observable<any> {

    return this.http.get(
      this.productApiUrl
    );

  }


  // ------------------------------------------
  // Add New Product
  // ------------------------------------------

  addProduct(
    product: FormData
  ): Observable<any> {

    return this.http.post(
      this.productApiUrl,
      product
    );

  }


  // ------------------------------------------
  // Update Product
  // ------------------------------------------

  updateProduct(
    id: string,
    product: FormData
  ): Observable<any> {

    return this.http.put(
      `${this.productApiUrl}/${id}`,
      product
    );

  }


  // ------------------------------------------
  // Delete Product
  // ------------------------------------------

  deleteProduct(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.productApiUrl}/${id}`
    );

  }


  // ==========================================
  // ORDERS
  // ==========================================

  // ------------------------------------------
  // Get All Orders - Admin
  // ------------------------------------------

  getAllOrders(): Observable<any> {

    return this.http.get(
      `${this.orderApiUrl}/admin/all`
    );

  }


  // ------------------------------------------
  // Update Order Status - Admin
  // ------------------------------------------

  updateOrderStatus(
    orderId: string,
    orderStatus: string
  ): Observable<any> {

    return this.http.put(
      `${this.orderApiUrl}/admin/${orderId}/status`,
      {
        orderStatus: orderStatus
      }
    );

  }

}

