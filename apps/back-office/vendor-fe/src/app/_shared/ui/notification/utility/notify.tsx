export const notify = (
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
) => {
  const notificationContainer = document.createElement('div');
  notificationContainer.id = 'notification-container';
  document.body.appendChild(notificationContainer);
  // ReactDOM.render(
  //   <NotificationComponent
  //     type={type}
  //     message={message}
  //     container={notificationContainer}
  //   />,
  //   notificationContainer,
  // );
};
