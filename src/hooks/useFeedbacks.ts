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
        mutationFn: ({ id, replyText }: { id: number; replyText: string }) => feedbacksApi.replyToFeedback(id, replyText),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
        },
    });
};
