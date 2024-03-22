'use cleint';

import { Button, FileInput, Flex, Modal } from '@mantine/core';
import React, { useState } from 'react';
import { useUploadToBriefcaseMutation } from '../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';

const UploadModal = ({
  opened,
  close,
  fetch,
}: {
  opened: boolean;
  close: () => void;
  fetch: any;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [upload] = useUploadToBriefcaseMutation();

  const handleUploadFile = async () => {
    if (file)
      try {
        await upload({ file })
          .unwrap()
          .then(() => {
            NotificationService.successNotification(
              'File Uploaded successfully',
            );
            close();
            fetch({});
          });
      } catch (error) {
        NotificationService.requestErrorNotification(
          'Something went wrong while uploading.',
        );
      }
  };

  return (
    <Modal opened={opened} onClose={close} title="Upload Documents" centered>
      <FileInput
        label="Upload files"
        placeholder="Upload files"
        // multiple
        accept="image/png,image/jpeg,application/pdf"
        // value={file}
        onChange={(file) => setFile(file)}
      />
      <Flex justify={'flex-end'} mt={'md'}>
        <Button disabled={!file} onClick={handleUploadFile}>
          Upload
        </Button>
      </Flex>
    </Modal>
  );
};

export default UploadModal;
