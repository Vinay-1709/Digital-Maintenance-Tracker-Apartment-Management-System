export interface MaintenanceRequest {
    id?: number;
    category: string;
    description: string;
    address: string;
    media?: string;
    status: 'New' | 'Assigned' | 'In-Progress' | 'Resolved';
    resident_name?: string;
    technician_name?: string;
    created_at?: string;
    technician_id?: number | null;
    feedback_rating?: number;
    feedback_comment?: string;
}
