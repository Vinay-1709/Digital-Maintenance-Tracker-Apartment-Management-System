import { Component, OnInit } from '@angular/core';
import { RequestService, MaintenanceRequest } from '../../../core/services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-technician-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    requests: MaintenanceRequest[] = [];
    displayedColumns: string[] = ['id', 'category', 'address', 'description', 'status', 'actions'];

    constructor(private requestService: RequestService, private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.requestService.getRequests().subscribe(data => {
            this.requests = data;
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'New': return 'primary';
            case 'Assigned': return 'accent';
            case 'In-Progress': return 'warn';
            case 'Resolved': return 'primary';
            default: return '';
        }
    }

    updateStatus(request: MaintenanceRequest, newStatus: string) {
        if (request.status === newStatus) return;

        this.requestService.updateStatus(request.id!, newStatus).subscribe({
            next: () => {
                this.snackBar.open(`Status updated to ${newStatus}`, 'Close', { duration: 3000 });
                request.status = newStatus as any;
            },
            error: () => {
                this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
            }
        });
    }

    viewMedia(path: string) {
        if (!path) return;
        const fullUrl = `${environment.apiUrl.replace('/api', '')}/${path.replace(/\\/g, '/')}`;
        window.open(fullUrl, '_blank');
    }
}
