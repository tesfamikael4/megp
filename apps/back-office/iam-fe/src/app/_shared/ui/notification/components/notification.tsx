/* eslint-disable react/jsx-no-useless-fragment */
import { Notification } from '@mantine/core';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
/* Props type */
export type NotificationProps = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  container: HTMLDivElement;
};

/* Component */
export default function NotificationComponent(props: NotificationProps) {
  /* UI states */
  const [alert, setAlert] = useState<
    'success' | 'error' | 'warning' | 'info' | null
  >(props.type);

  /* useEffect hooks */
  useEffect(() => {
    if (alert != null) {
      const timer: any = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    } else if (alert === null) {
      document.body.removeChild(props.container);
    }
  }, [alert]);

  /* Event handlers */
  const handleClose = () => {
    setAlert(null);
  };

  return (
    <>
      {alert != null && (
        <div>
          {/* <Alert
            className="fixed bottom-0 right-0 z-50    mb-4 mr-2
          flex flex w-auto items-center  justify-end p-4  "
            icon={
              props.type === 'success' ? (
                <IconCircleCheck className="icon-md  text-white" size={64} />
              ) : props.type === 'error' ? (
                <IconAlertCircle className="icon-md text-white " size={64} />
              ) : props.type === 'warning' ? (
                <IconAlertTriangle className="icon-md text-white " size={64} />
              ) : (
                <IconInfoCircle className="icon-md text-white " size={64} />
              )
            }
            // color={
            //   props.type === 'success'
            //     ? 'white'
            //     : props.type === 'error'
            //     ? 'red'
            //     : props.type === 'warning'
            //     ? 'yellow'
            //     : 'cyan'
            // }
            radius="sm"
            onClick={handleClose}
            variant="filled"
            classNames={{
              root: 'w-full h-100',
              icon: 'w-10 ',
            }}
          >
            <div className="flex items-center">
              <p className="w-auto text-sm font-bold "> {props.message}</p>
              <button className="my-0 ml-2">
                <IconX />
              </button>
            </div>
          </Alert> */}

          <Notification
            className="fixed bottom-0 right-0 z-50    mb-4 mr-2
           flex flex w-auto items-center  justify-end p-4  "
            icon={
              props.type === 'success' ? (
                <IconCircleCheck className="icon-md  text-white" size={64} />
              ) : props.type === 'error' ? (
                <IconAlertCircle className="icon-md text-white " size={64} />
              ) : props.type === 'warning' ? (
                <IconAlertTriangle className="icon-md text-white " size={64} />
              ) : (
                <IconInfoCircle className="icon-md text-white " size={64} />
              )
            }
            color={
              props.type === 'success'
                ? '#0c4a6e'
                : props.type === 'error'
                ? 'red'
                : props.type === 'warning'
                ? 'yellow'
                : 'blue'
            }
            title={
              props.type === 'success'
                ? 'Success'
                : props.type === 'error'
                ? 'Error'
                : props.type === 'warning'
                ? 'Warning'
                : 'Info'
            }
            onClose={handleClose}
          >
            {props.message}
          </Notification>
        </div>
      )}
    </>
  );
}
