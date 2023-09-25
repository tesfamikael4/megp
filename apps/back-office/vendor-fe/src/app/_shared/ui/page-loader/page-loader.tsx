import { LoadingOverlay } from '@mantine/core';
import * as React from 'react';
/* eslint-disable-next-line */
export interface PageLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  variant?: 'oval' | 'bars' | 'dots';
  overlayOpacity?: number;
  overlayColor?: string;
  visible?: boolean;
}
export function PageLoader(props: PageLoaderProps) {
  return (
    <LoadingOverlay
      visible={props.visible ?? true}
      loaderProps={{
        size: props?.size ?? 'sm',
        color: props?.color ?? 'sky',
        variant: props?.variant ?? 'oval',
      }}
      overlayOpacity={props?.overlayOpacity ?? 0.3}
      overlayColor={props?.overlayColor ?? '#94a3b8'}
    />
  );
}

export default PageLoader;
