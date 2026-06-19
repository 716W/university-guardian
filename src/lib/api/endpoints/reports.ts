import { apiClient } from '../apiClient';
import { ReportListItem, ReportDetails } from '../../../types/report';

export interface PaginatedResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    succeeded: boolean;
    message: string;
    data: T[];
}

export interface GetAdminReportsParams {
    search?: string;
    categoryId?: number | string;
    locationId?: number | string;
    statusType?: number | string;
    reportType?: number | string;
    fromDate?: string;
    toDate?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface ApiResponse<T> {
    succeeded: boolean;
    message: string;
    data: T;
    errors: any;
}

export const fetchAdminReports = async (params: GetAdminReportsParams): Promise<PaginatedResponse<ReportListItem>> => {
    // clean up params to remove empty strings/undefined
    const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== "" && v !== "all")
    );
    const { data } = await apiClient.get<PaginatedResponse<ReportListItem>>('/api/v1/admin/reports', {
        params: {
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 10,
            ...cleanedParams
        }
    });
    return data;
};

export const fetchReportById = async (id: number | string): Promise<ApiResponse<ReportDetails>> => {
    const numericId = Number(id);
    const { data } = await apiClient.get<ApiResponse<ReportDetails>>(`/api/v1/reports/${numericId}`);
    return data;
};

export const deleteReport = async (id: number | string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/reports/${id}`);
};

export const updateReport = async (id: number | string, payload: any): Promise<ApiResponse<any>> => {
    const numericId = Number(id);
    const { data } = await apiClient.put(`/api/v1/reports/${numericId}`, payload);
    return data;
};

export const changeReportStatus = async (id: number | string, statusType: number | string): Promise<ApiResponse<any>> => {
    const numericId = Number(id);
    const numericStatus = Number(statusType);
    const { data } = await apiClient.put(`/api/v1/admin/reports/${numericId}/status`, { statusType: numericStatus });
    return data;
};
