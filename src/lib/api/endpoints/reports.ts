import { apiClient } from '../apiClient';

export interface ReportItem {
    id: number;
    itemName: string;
    description?: string;
    imagePath: string;
    dateReported: string;
    reportType: number; // 1 for lost, 2 for found
}

export interface PaginatedResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    succeeded: boolean;
    message: string;
    data: T[];
}

export interface GetReportsParams {
    pageNumber?: number;
    pageSize?: number;
}

export const fetchReports = async (params: GetReportsParams): Promise<PaginatedResponse<ReportItem>> => {
    const { data } = await apiClient.get<PaginatedResponse<ReportItem>>('/api/v1/reports', {
        params: {
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 10,
        }
    });
    return data;
};


export interface ReportDetails {
    id: number;
    itemName: string;
    images?: { id: number, path: string }[];
    reportType: number;
    locationName?: string;
    dateReported: string;
    description?: string;
}

export interface ApiResponse<T> {
    succeeded: boolean;
    message: string;
    data: T;
    errors: any;
}

export const fetchReportById = async (id: number | string): Promise<ApiResponse<ReportDetails>> => {
    const { data } = await apiClient.get<ApiResponse<ReportDetails>>(`/api/v1/reports/${id}`);
    return data;
};

export const deleteReport = async (id: number | string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/reports/${id}`);
};

export const updateReport = async (id: number | string, formData: FormData): Promise<void> => {
    await apiClient.put(`/api/v1/reports/${id}`, formData);
};
