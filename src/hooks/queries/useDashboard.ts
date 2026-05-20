import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../../lib/api/endpoints/dashboard';
import { DashboardData } from '../../types/dashboard';

export const useGetDashboardData = () => {
    return useQuery<DashboardData, Error>({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardData,
    });
};
