import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Modal as MantineModal, Button } from '@mantine/core';
import React from 'react';

interface ModalProps {
  opened: boolean;
  modalHandler?: {
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  children: React.ReactNode;
  [key: string]: any;
}
export function PopupModal({
  opened,
  modalHandler,
  children,
  ...props
}: ModalProps) {
  const isMobile = useMediaQuery('(max-width: 50em)');

  return (
    <MantineModal
      opened={opened}
      onClose={() => modalHandler?.close()}
      fullScreen={isMobile}
      transitionProps={{ transition: 'fade', duration: 200 }}
      size="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      {...props}
    >
      {children}
    </MantineModal>
  );
}
