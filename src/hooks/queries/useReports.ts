import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReports, GetReportsParams, fetchReportById, deleteReport, updateReport } from '../../lib/api/endpoints/reports';

export const useGetReports = (params: GetReportsParams) => {
    return useQuery({
        queryKey: ['reports', params.pageNumber, params.pageSize],
        queryFn: () => fetchReports(params),
    });
};


export const useGetReportById = (id: number | string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['report', id],
        queryFn: () => fetchReportById(id),
        enabled: enabled && !!id,
    });
};

export const useDeleteReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteReport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};

export const useUpdateReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id: number | string, formData: FormData }) => updateReport(id, formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['report', variables.id] });
        },
    });
};
