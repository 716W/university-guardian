export interface ApiResponse<T> {
    succeeded: boolean;
    message: string;
    data: T;
    errors: string[] | null;
}

export interface PaginatedApiResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    succeeded: boolean;
    message: string;
    data: T;
}
