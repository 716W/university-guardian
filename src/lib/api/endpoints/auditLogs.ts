import { apiClient } from '../apiClient';
import { PaginatedApiResponse } from '@/types/api';
import { AuditLog } from '@/types/auditLog';

export const auditLogsApi = {
    fetchAuditLogs: async (page: number, pageSize: number, searchTerm: string = '') => {
        const response = await apiClient.get<PaginatedApiResponse<AuditLog[]>>(`/api/v1/admin/audit-logs`, {
            params: {
                page,
                pageSize,
                searchTerm
            }
        });
        return response.data;
    }
};
