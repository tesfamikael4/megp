import { notifications, showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
export * from './type';

export class NotificationService {
  static successNotification(message: string): void {
    showNotification({
      withCloseButton: true,
      autoClose: 3000,
      color: 'teal',
      title: '',
      message: message,
      icon: <IconCheck size="1rem" />,
    });
  }
  static requestErrorNotification(message: string): void {
    showNotification({
      withCloseButton: true,
      autoClose: 3000,
      color: 'orange',
      title: '',
      message: message,
      icon: <IconX size="1rem" />,
    });
  }
  static runtimeErrorNotification(): void {
    notifications.show({
      id: 'runtimeErrorNotification',
      withCloseButton: true,
      autoClose: 5000,
      title: 'Runtime Error',
      message: 'Oops! An unexpected error occurred during program execution.',
      icon: <IconX />,
      loading: false,
    });
  }

  static networkErrorNotification(): void {
    notifications.show({
      id: 'networkErrorNotification',
      withCloseButton: true,
      autoClose: false,
      title: 'Network Error',
      message: 'Oops! There was an issue with the network connectivity.',
      icon: <IconX />,
      loading: false,
    });
  }
}
