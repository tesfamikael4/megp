import { Paper } from '@mantine/core';
import React, { PropsWithChildren } from 'react';

interface CardLayoutProps extends PropsWithChildren {
  header?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  footer?: React.ReactNode;
  footerRight?: React.ReactNode;
  footerLeft?: React.ReactNode;
  className?: string;
  [key: string]: any;
}
export default function CardLayout(props: CardLayoutProps) {
  return (
    <Paper
      {...props}
      className={`${props.className && props.className} overflow-hidden `}
    >
      <div
        className={`${props.header && 'border-b'} ${
          props.headerBorder == false && 'border-0'
        } px-4 py-5 sm:px-6 w-full`}
      >
        {props.header && props.header}
      </div>
      <div className="px-4 py-5 sm:p-6 min-h-[100px] w-full">
        {props.children}
      </div>
      <div className={`${props.footer && 'border-t'} px-4 py-4 sm:px-6 w-full`}>
        {props.footer && props.footer}
      </div>
    </Paper>
  );
}
