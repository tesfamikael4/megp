import React from 'react';
import NotificationCard from '../notification-cards';

const NotificationList: React.FC = () => {
  const notifications: any = [
    {
      organizationName: 'Company A',
      description: 'Your account has been successfully created.',
      type: 'success',
    },
    {
      organizationName: 'Company C',
      description: 'New updates available. Click here to install.',
      type: 'warning',
    },
    {
      organizationName: 'Company D',
      description: 'Reminder: Your subscription will expire soon.',
      type: 'warning',
    },
    {
      organizationName: 'Company E',
      description: 'Your order has been shipped. Track it now.',
      type: 'success',
    },
    // Add more notifications as needed
  ];
  return (
    <>
      {notifications.map((notification, index) => (
        <NotificationCard
          key={index}
          organizationName={notification.organizationName}
          description={notification.description}
          type={notification.type}
        />
      ))}
    </>
  );
};

export default NotificationList;
