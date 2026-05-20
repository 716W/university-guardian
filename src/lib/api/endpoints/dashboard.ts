import * as apiClient from '../apiClient';
import * as api from '../../../types/api';
import * as dashboard from '../../../types/dashboard';

/**
 * Fetches the dashboard overview, categories, and activity data.
 */
export const fetchDashboardData = async (): Promise<dashboard.DashboardData> => {
    // Using the wrapper ApiResponse<T> to unwrap the response format specified by the backend
    const { data } = await apiClient.apiClient.get<api.ApiResponse<dashboard.DashboardData>>('/api/v1/admin/dashboard/stats');

    if (!data.succeeded) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
    }

    return data.data;
};
