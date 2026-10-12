import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

   private apiUrl = 'http://localhost:5000/api/contact';

  constructor(private http: HttpClient) {}

  sendMessage(contactData: any): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      contactData
    );

  }

  getAllMessages(): Observable<any> {

    return this.http.get<any>(
      this.apiUrl
    );

  }

  getMessageById(id: string): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );

  }

  markAsRead(id: string): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}/read`,
      {}
    );

  }

}

