import React from 'react';
import { Avatar, Text } from '@mantine/core';
import { useGetNotificationsQuery } from '../../_api/notifications.api';
import { findNotifDate } from './utils';

// Notification component
export interface NotificationProps {
  opened: boolean;
  setOpened: (any) => void;
  user: any;
}
const Notification = () => {
  const { data: notifications } = useGetNotificationsQuery({});

  return (
    <>
      <div
        className={`w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow `}
        style={{ minWidth: '300px' }}
      >
        <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 ">
          Notifications
        </div>
        {notifications && notifications.total > 0 ? (
          <>
            <div className="divide-y divide-gray-100 ">
              {notifications.items.map((notification) => (
                <a
                  key={notification.id}
                  href="#"
                  className="flex px-4 py-3 hover:bg-gray-100 "
                >
                  <>
                    <div className="flex-shrink-0">
                      <Avatar />
                      <div
                        className={`absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 border border-white rounded-full `}
                      ></div>
                    </div>
                    <div className="w-full ps-3">
                      <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                        {notification.content}
                      </div>
                      <div className="text-xs text-blue-600 ">
                        {findNotifDate(notification.createdAt)}
                      </div>
                    </div>
                  </>
                </a>
              ))}
            </div>
            {/* <a
              href="#"
              className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 "
            >
              <div className="inline-flex items-center">
                <IconEye />
                View all
              </div>
            </a> */}
          </>
        ) : (
          <Text size="sm" p={'md'}>
            No notifications
          </Text>
        )}
      </div>
    </>
  );
};

export default Notification;
