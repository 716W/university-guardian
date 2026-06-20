import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbacksApi } from '@/lib/api/endpoints/feedbacks';

export const useGetFeedbacks = (pendingOnly?: boolean) => {
    return useQuery({
        queryKey: ['feedbacks', pendingOnly],
        queryFn: () => feedbacksApi.fetchFeedbacks(pendingOnly),
    });
};

export const useReplyToFeedback = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, adminReply }: { id: number; adminReply: string }) => feedbacksApi.replyToFeedback(id, adminReply),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
            queryClient.invalidateQueries({ queryKey: ['adminFeedbacks'] });
        },
    });
};
