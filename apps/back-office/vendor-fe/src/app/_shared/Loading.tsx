import { LoadingOverlay } from '@mantine/core';

export default function Loading() {
  return (
    <LoadingOverlay
      loaderProps={{ variant: 'oval' }}
      overlayOpacity={0.4}
      //   overlayColor="#c5c5c5"
      visible
    />
  );
}
