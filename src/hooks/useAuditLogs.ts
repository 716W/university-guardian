import { useQuery } from '@tanstack/react-query';
import { auditLogsApi } from '@/lib/api/endpoints/auditLogs';

export const useGetAuditLogs = (page: number, pageSize: number, searchTerm: string) => {
    return useQuery({
        queryKey: ['auditLogs', page, pageSize, searchTerm],
        queryFn: () => auditLogsApi.fetchAuditLogs(page, pageSize, searchTerm),
        placeholderData: (prev) => prev,
    });
};
