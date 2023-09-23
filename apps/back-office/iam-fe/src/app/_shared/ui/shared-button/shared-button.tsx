import { Button } from '@mantine/core';
import * as React from 'react';
import { ReactNode } from 'react';
export interface UiSrcSharedButtonProps {
  isLoading?: boolean;
  isCompact?: boolean;
  children?: ReactNode;
  component?: 'button';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type?: 'button' | 'submit' | 'reset';
  onClick?: any;
  className?: string;
  color?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  loaderPosition?: 'left' | 'right';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  radius?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  upperCase?: boolean;
  variant?: 'filled' | 'outline' | 'default' | 'light' | 'subtle';
  label?: string;
}

export function SharedButton(props: UiSrcSharedButtonProps) {
  return (
    <Button
      variant={props.variant}
      component={props.component}
      uppercase={props.upperCase}
      leftIcon={props.leftIcon}
      rightIcon={props.rightIcon}
      loaderPosition={props.loaderPosition || 'left'}
      fullWidth={props.fullWidth}
      disabled={props.disabled}
      color={props.color}
      className={props.className}
      type={props.type}
      loading={props.isLoading}
      compact={props.isCompact}
      size={props.size || 'sm'}
      radius={props.radius || 'sm'}
      onClick={props.onClick}
      styles={(theme) => ({
        root: {
          paddingLeft: 12,
          paddingRight: 12,
        },
        leftIcon: {
          marginRight: 1,
          marginLeft: 1,
        },
      })}
    >
      {props.label}
    </Button>
  );
}

export default SharedButton;
