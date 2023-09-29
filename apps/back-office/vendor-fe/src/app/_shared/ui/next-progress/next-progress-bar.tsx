import NextNProgress from 'nextjs-progressbar';
import * as React from 'react';
type ProgressBarProps = {
  color?: string;
  height?: number;
  speed?: number;
  showOnShallow?: boolean;
};
export function PageLoadingIndicator(props: ProgressBarProps) {
  return (
    <NextNProgress
      height={props?.height ?? 3}
      color={props?.color ?? '#f0b70c'}
      options={{ easing: 'ease', speed: props?.speed ?? 500 }}
      showOnShallow={props?.showOnShallow ?? true}
    />
  );
}
