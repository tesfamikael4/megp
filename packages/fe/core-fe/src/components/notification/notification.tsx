import { notifications } from '@mantine/notifications';

export const notify = (type, msg) => {
  type === 'Success'
    ? notifications.show({
        message: msg,
        title: 'Success',
        color: 'green',
      })
    : notifications.show({
        message: msg,
        title: 'Error',
        color: 'red',
      });
};
