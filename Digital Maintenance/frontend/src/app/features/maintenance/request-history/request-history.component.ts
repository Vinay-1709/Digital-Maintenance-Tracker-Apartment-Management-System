import { Component, OnInit } from '@angular/core';
import { RequestService, MaintenanceRequest } from '../../../core/services/request.service';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-request-history',
    templateUrl: './request-history.component.html',
    styleUrls: ['./request-history.component.scss']
})
export class RequestHistoryComponent implements OnInit {
    requests: MaintenanceRequest[] = [];
    displayedColumns: string[] = ['id', 'category', 'address', 'description', 'created_at', 'status', 'actions'];

    selectedRequestForFeedback: MaintenanceRequest | null = null;
    feedbackRating: number = 5;
    feedbackComment: string = '';

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
            case 'Resolved': return 'primary'; // or a custom success color class if configured
            default: return '';
        }
    }

    viewMedia(path: string) {
        // Assuming path is relative like 'uploads/file.jpg'
        // Construct full URL
        const fullUrl = `${environment.apiUrl.replace('/api', '')}/${path.replace(/\\/g, '/')}`;
        window.open(fullUrl, '_blank');
    }

    openFeedback(request: MaintenanceRequest) {
        this.selectedRequestForFeedback = request;
        this.feedbackRating = 5;
        this.feedbackComment = '';
    }

    cancelFeedback() {
        this.selectedRequestForFeedback = null;
    }

    submitFeedback() {
        if (!this.selectedRequestForFeedback) return;

        this.requestService.submitFeedback(this.selectedRequestForFeedback.id!, this.feedbackRating, this.feedbackComment)
            .subscribe(() => {
                this.snackBar.open('Feedback submitted', 'Close', { duration: 3000 });
                this.selectedRequestForFeedback = null;
                this.loadRequests(); // Refresh list to show rating status
            });
    }
}
