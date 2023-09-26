import ReactDOM from 'react-dom';
import NotificationComponent from '../components/notification';
export const notify = (
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
) => {
  const notificationContainer = document.createElement('div');
  notificationContainer.id = 'notification-container';
  document.body.appendChild(notificationContainer);
  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(
    <NotificationComponent
      type={type}
      message={message}
      container={notificationContainer}
    />,
    notificationContainer,
  );
};
