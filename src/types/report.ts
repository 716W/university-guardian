export interface ReportListItem {
    id: number | string;
    itemName: string;
    imagePath?: string;
    reportType: number; // 1 for lost, 2 for found
    status: number; // 0: pending, 1: resolved, etc. depending on backend
    locationName?: string;
    reporterName?: string;
    userName?: string;
    dateReported: string;
    categoryName?: string;
}

export interface ReportImage {
    id?: number;
    path: string;
}

export interface ReportDetails extends ReportListItem {
    description?: string;
    images?: string[];
}
