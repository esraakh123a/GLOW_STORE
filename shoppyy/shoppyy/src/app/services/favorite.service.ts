
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = 'http://localhost:5000/api/favorites';

  // عدد الـ Favorites
  private favoriteCountSubject = new BehaviorSubject<number>(0);

  favoriteCount$ = this.favoriteCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get Favorites
  getFavorites(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Load Favorites Count
  loadFavoriteCount(): void {

    this.getFavorites().subscribe({
      next: (res) => {

        const favorites = res.favorites || [];

        this.favoriteCountSubject.next(favorites.length);

      },

      error: (err) => {

        console.error('Error loading favorites count:', err);

        this.favoriteCountSubject.next(0);

      }
    });

  }

  // Add Favorite
  addToFavorites(productId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${productId}`,
      {}
    );
  }

  // Remove Favorite
  removeFromFavorites(productId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${productId}`
    );
  }

}

