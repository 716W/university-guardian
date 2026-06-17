import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminReports, GetAdminReportsParams, fetchReportById, deleteReport, updateReport, changeReportStatus, PaginatedResponse } from '../../lib/api/endpoints/reports';
import { ReportListItem } from '../../types/report';

export const useGetAdminReports = (params: GetAdminReportsParams) => {
    return useQuery({
        queryKey: ['adminReports', params],
        queryFn: () => fetchAdminReports(params),
    });
};

export const useGetReportDetails = (id: number | string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['reportDetails', id],
        queryFn: () => fetchReportById(id),
        enabled: enabled && !!id,
    });
};

export const useDeleteReport = (filtersObj: GetAdminReportsParams) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteReport(id),
        onSuccess: (_, deletedId) => {
            const queryKey = ['adminReports', filtersObj];
            queryClient.setQueryData(queryKey, (oldData: PaginatedResponse<ReportListItem> | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    totalRecords: oldData.totalRecords - 1,
                    data: oldData.data.filter((item) => item.id !== deletedId),
                };
            });
        },
    });
};

export const useEditReport = (filtersObj: GetAdminReportsParams) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string, data: any }) => updateReport(id, data),
        onSuccess: (_, variables) => {
            const queryKey = ['adminReports', filtersObj];
            queryClient.setQueryData(queryKey, (oldData: PaginatedResponse<ReportListItem> | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((item) => {
                        if (item.id === variables.id) {
                            return {
                                ...item,
                                itemName: variables.data.title || variables.data.itemName || item.itemName,
                                reportType: variables.data.reportType !== undefined ? Number(variables.data.reportType) : item.reportType,
                            };
                        }
                        return item;
                    }),
                };
            });
            // Also invalidate details to ensure fresh data on next view
            queryClient.invalidateQueries({ queryKey: ['reportDetails', variables.id] });
        },
    });
};

export const useChangeReportStatus = (filtersObj: GetAdminReportsParams) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, statusType }: { id: number | string, statusType: number }) => changeReportStatus(id, statusType),
        onSuccess: (_, variables) => {
            const queryKey = ['adminReports', filtersObj];
            queryClient.setQueryData(queryKey, (oldData: PaginatedResponse<ReportListItem> | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((item) => 
                        item.id === variables.id ? { ...item, status: variables.statusType } : item
                    ),
                };
            });
            queryClient.invalidateQueries({ queryKey: ['reportDetails', variables.id] });
        },
    });
};
