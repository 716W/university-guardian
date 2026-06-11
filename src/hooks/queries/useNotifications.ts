import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyNotifications, markAsRead, deleteNotification } from '../../lib/api/endpoints/notifications';
import { NotificationItem } from '../../types/notification';

export const useGetNotifications = () => {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: fetchMyNotifications,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
