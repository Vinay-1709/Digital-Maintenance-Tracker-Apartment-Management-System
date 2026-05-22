import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MaintenanceRequest } from '../models/maintenance-request.model';
export { MaintenanceRequest };

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    constructor(private http: HttpClient) { }

    getCategories(): Observable<string[]> {
        return this.http.get<string[]>(`${environment.apiUrl}/requests/categories`);
    }

    createRequest(data: FormData): Observable<any> {
        return this.http.post(`${environment.apiUrl}/requests`, data);
    }

    getRequests(): Observable<MaintenanceRequest[]> {
        return this.http.get<MaintenanceRequest[]>(`${environment.apiUrl}/requests`);
    }

    getRequestById(id: number): Observable<MaintenanceRequest> {
        return this.http.get<MaintenanceRequest>(`${environment.apiUrl}/requests/${id}`);
    }

    assignTechnician(requestId: number, technicianId: number): Observable<any> {
        return this.http.patch(`${environment.apiUrl}/requests/${requestId}/assign`, { technicianId });
    }

    updateStatus(requestId: number, status: string): Observable<any> {
        return this.http.patch(`${environment.apiUrl}/requests/${requestId}/status`, { status });
    }

    submitFeedback(requestId: number, rating: number, comment: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/requests/${requestId}/feedback`, { rating, comment });
    }
}
