import { LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { PropsWithChildren, useEffect } from 'react';

interface Props extends PropsWithChildren {
  requestInfo: any;
  onSuccessCallback?: () => void;
}

const RequestHandler: React.FC<Props> = ({
  requestInfo,
  children,
  onSuccessCallback,
}) => {
  useEffect(() => {
    return () => {
      console.log('call');
      if (requestInfo.isError) {
        notifications.show({
          withCloseButton: true,
          autoClose: 5000,
          color: 'yellow',
          title: 'Warning',
          message: 'Oops! There is an error on the request.',
        });
      }
    };
  }, [requestInfo.isError]);

  useEffect(() => {
    if (
      requestInfo.isSuccess &&
      requestInfo.data !== null &&
      onSuccessCallback
    ) {
      onSuccessCallback();
    }
    return () => {};
  }, [requestInfo.isSuccess, requestInfo.data]);

  return (
    <>
      {requestInfo.isLoading && !requestInfo.isError && (
        <LoadingOverlay
          visible={requestInfo.isLoading}
          overlayProps={{ blur: 1 }}
        />
      )}
      {children}
    </>
  );
};

export default RequestHandler;
