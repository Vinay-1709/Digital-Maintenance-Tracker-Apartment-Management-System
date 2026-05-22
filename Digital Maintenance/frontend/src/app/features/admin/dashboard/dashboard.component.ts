import { Component, OnInit } from '@angular/core';
import { RequestService, MaintenanceRequest } from '../../../core/services/request.service';
import { UserService } from '../../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    requests: MaintenanceRequest[] = [];
    technicians: any[] = [];
    displayedColumns: string[] = ['id', 'category', 'address', 'description', 'status', 'technician', 'actions'];

    constructor(
        private requestService: RequestService,
        private userService: UserService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.requestService.getRequests().subscribe(data => {
            this.requests = data;
        });

        this.userService.getTechnicians().subscribe(data => {
            this.technicians = data;
        });
    }

    getPendingCount() {
        return this.requests.filter(r => r.status === 'New').length;
    }

    getTechnicianName(id: number) {
        const tech = this.technicians.find(t => t.id === id);
        return tech ? tech.name : 'Unknown';
    }

    assignTechnician(request: MaintenanceRequest, techId: number) {
        this.requestService.assignTechnician(request.id!, techId).subscribe({
            next: () => {
                this.snackBar.open('Technician assigned', 'Close', { duration: 3000 });
                request.technician_id = techId;
                request.status = 'Assigned';
            },
            error: () => {
                this.snackBar.open('Failed to assign technician', 'Close', { duration: 3000 });
            }
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

    viewMedia(path: string) {
        if (!path) return;
        const fullUrl = `${environment.apiUrl.replace('/api', '')}/${path.replace(/\\/g, '/')}`;
        window.open(fullUrl, '_blank');
    }
}
