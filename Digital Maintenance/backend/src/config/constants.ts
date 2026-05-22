export const MAINTENANCE_CATEGORIES = [
    'Plumbing',
    'Electrical',
    'Painting',
    'Carpentry',
    'Cleaning',
    'Appliance Repair',
    'Other'
] as const;

export type MaintenanceCategory = typeof MAINTENANCE_CATEGORIES[number];

export const REQUEST_STATUSES = [
    'New',
    'Assigned',
    'In-Progress',
    'Resolved'
] as const;

export type RequestStatus = typeof REQUEST_STATUSES[number];
