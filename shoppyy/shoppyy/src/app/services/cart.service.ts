import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:5000/api/cart';

  private cartCountSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Add product to cart
  addToCart(productId: string, quantity: number): Observable<any> {

    return this.http.post<any>(this.apiUrl, {
      productId,
      quantity
    }).pipe(

      tap(response => {

        if (response.cart && response.cart.items) {

          const count = response.cart.items.reduce(
            (total: number, item: any) => total + item.quantity,
            0
          );

          this.cartCountSubject.next(count);

        }

      })

    );
  }

  // Get cart
  getCart(): Observable<any> {

    return this.http.get<any>(this.apiUrl).pipe(

      tap(response => {

        if (response.cart && response.cart.items) {

          const count = response.cart.items.reduce(
            (total: number, item: any) => total + item.quantity,
            0
          );

          this.cartCountSubject.next(count);

        }

      })

    );
  }

  // Update quantity
  updateCartItem(
    productId: string,
    quantity: number
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${productId}`,
      { quantity }
    ).pipe(

      tap(response => {

        if (response.cart && response.cart.items) {

          const count = response.cart.items.reduce(
            (total: number, item: any) => total + item.quantity,
            0
          );

          this.cartCountSubject.next(count);

        }

      })

    );
  }

  // Remove product
  removeFromCart(productId: string): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${productId}`
    ).pipe(

      tap(response => {

        if (response.cart && response.cart.items) {

          const count = response.cart.items.reduce(
            (total: number, item: any) => total + item.quantity,
            0
          );

          this.cartCountSubject.next(count);

        }

      })

    );
  }

  // Clear cart
  clearCart(): Observable<any> {

    return this.http.delete<any>(this.apiUrl).pipe(

      tap(() => {
        this.cartCountSubject.next(0);
      })

    );
  }

  // Manual update
  updateCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }
}