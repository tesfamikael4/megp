import { Button, FileInput, Flex, Modal } from '@mantine/core';
import React from 'react';

const UploadModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  return (
    <Modal opened={opened} onClose={close} title="Upload Documents" centered>
      <FileInput
        label="Upload files"
        placeholder="Upload files"
        multiple
        accept="image/png,image/jpeg,application/pdf"
      />
      <Flex justify={'flex-end'} mt={'md'}>
        <Button>Upload</Button>
      </Flex>
    </Modal>
  );
};

export default UploadModal;
