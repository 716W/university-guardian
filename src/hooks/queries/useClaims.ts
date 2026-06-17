import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminClaims, GetAdminClaimsParams, fetchClaimById, approveClaim, rejectClaim } from '../../lib/api/endpoints/claims';
import { ClaimListItem } from '../../types/claim';
import { PaginatedApiResponse } from '../../types/api';

export const useGetAdminClaims = (params: GetAdminClaimsParams) => {
    return useQuery({
        queryKey: ['adminClaims', params],
        queryFn: () => fetchAdminClaims(params),
    });
};

export const useGetClaimDetails = (id: number | string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['claimDetails', id],
        queryFn: () => fetchClaimById(id),
        enabled: enabled && !!id,
    });
};

export const useApproveClaim = (filtersObj: GetAdminClaimsParams) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => approveClaim(id),
        onSuccess: (_, id) => {
            const queryKey = ['adminClaims', filtersObj];
            queryClient.setQueryData(queryKey, (oldData: PaginatedApiResponse<ClaimListItem[]> | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((item) => 
                        item.id === id ? { ...item, approvalStatus: 2 } : item
                    ),
                };
            });
            // Invalidate details as well to keep them fresh
            queryClient.invalidateQueries({ queryKey: ['claimDetails', id] });
        },
    });
};

export const useRejectClaim = (filtersObj: GetAdminClaimsParams) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => rejectClaim(id),
        onSuccess: (_, id) => {
            const queryKey = ['adminClaims', filtersObj];
            queryClient.setQueryData(queryKey, (oldData: PaginatedApiResponse<ClaimListItem[]> | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((item) => 
                        item.id === id ? { ...item, approvalStatus: 4 } : item
                    ),
                };
            });
            // Invalidate details as well to keep them fresh
            queryClient.invalidateQueries({ queryKey: ['claimDetails', id] });
        },
    });
};
