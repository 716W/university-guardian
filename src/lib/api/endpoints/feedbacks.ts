import { apiClient } from '../apiClient';
import { ApiResponse } from '@/types/api';
import { Feedback } from '@/types/feedback';

export const feedbacksApi = {
    fetchFeedbacks: async (pendingOnly?: boolean) => {
        const response = await apiClient.get<ApiResponse<Feedback[]>>(`/api/v1/admin/feedbacks`, {
            params: pendingOnly !== undefined ? { pendingOnly } : undefined
        });
        return response.data;
    },
    replyToFeedback: async (id: number, replyText: string) => {
        const response = await apiClient.post<ApiResponse<void>>(`/api/v1/admin/feedbacks/${id}/reply`, { replyText });
        return response.data;
    }
};
