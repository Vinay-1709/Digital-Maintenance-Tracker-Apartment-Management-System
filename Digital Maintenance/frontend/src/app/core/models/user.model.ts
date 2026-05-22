export interface User {
    id: number;
    name: string;
    email: string;
    role: 'resident' | 'technician' | 'admin';
    contact_info?: string;
    created_at?: string;
}
