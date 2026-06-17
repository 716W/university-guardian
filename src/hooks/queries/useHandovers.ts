import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createHandover, getHandoverDetails, getHandoverByClaim } from '../../lib/api/endpoints/handovers';
import { PaginatedResponse } from '../../lib/api/endpoints/reports';
import { ReportListItem } from '../../types/report';
import { ClaimListItem } from '../../types/claim';
import { toast } from 'sonner';

export const useCreateHandover = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => createHandover(formData),
        onSuccess: (_, variables) => {
            const reportId = variables.get('reportId');
            const claimId = variables.get('claimId');

            if (reportId) {
                // Update all adminReports queries in the cache
                queryClient.setQueriesData({ queryKey: ['adminReports'] }, (oldData: PaginatedResponse<ReportListItem> | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((item) =>
                            item.id.toString() === reportId.toString() ? { ...item, status: 3 } : item // Assuming 3 is "Returned" or "Closed"
                        ),
                    };
                });
                queryClient.invalidateQueries({ queryKey: ['reportDetails', reportId] });
            }

            if (claimId) {
                // Update all claims queries in the cache
                queryClient.setQueriesData({ queryKey: ['adminClaims'] }, (oldData: PaginatedResponse<ClaimListItem> | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((item) =>
                            item.id.toString() === claimId.toString() ? { ...item, approvalStatus: 3 } : item // Assuming 3 is closed/returned
                        ),
                    };
                });
                queryClient.invalidateQueries({ queryKey: ['claimDetails', claimId] });
            }

            toast.success("Handover completed successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to complete handover");
        }
    });
};

export const useGetHandoverDetails = (id: number | string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['handoverDetails', id],
        queryFn: () => getHandoverDetails(id),
        enabled: enabled && !!id,
    });
};

export const useGetHandoverByClaim = (claimId: number | string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['handoverByClaim', claimId],
        queryFn: () => getHandoverByClaim(claimId),
        enabled: enabled && !!claimId,
    });
};
