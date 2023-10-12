export interface NotificationOptions {
  id: string;
  withCloseButton?: boolean;
  autoClose?: number | boolean | undefined;
  title?: string | React.ReactNode;
  message?: string;
  color?: string;
  icon?: JSX.Element;
  loading?: boolean;
}

export interface Notification {
  id: string;
  options: NotificationOptions;
}
