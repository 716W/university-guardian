import { apiClient } from '../apiClient';
import { NotificationItem } from '../../../types/notification';

interface StandardResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

export const fetchMyNotifications = async (): Promise<NotificationItem[]> => {
  const response = await apiClient.get<StandardResponse<NotificationItem[]>>('/api/v1/notifications/me');
  return response.data.data;
};

export const markAsRead = async (id: number): Promise<void> => {
  await apiClient.put<StandardResponse<void>>(`/api/v1/notifications/${id}/read`);
};

export const deleteNotification = async (id: number): Promise<void> => {
  await apiClient.delete<StandardResponse<void>>(`/api/v1/notifications/${id}`);
};
