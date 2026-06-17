export interface AuditLog {
    id: number;
    timestamp: string;
    adminName: string;
    action: string;
    target: string;
    ipAddress: string;
}
