with open('src/lib/api/endpoints/reports.ts', 'r', encoding='utf-8') as f:
    text = f.read()

new_endpoints = """
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
    await apiClient.put(`/api/v1/reports/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
"""

text += "\n" + new_endpoints

with open('src/lib/api/endpoints/reports.ts', 'w', encoding='utf-8') as f:
    f.write(text)
