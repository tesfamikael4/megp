'use cleint';

import { Button, FileInput, Flex, Modal, Textarea } from '@mantine/core';
import React, { useState } from 'react';
import { useUploadToBriefcaseMutation } from '../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const briefcaseSchema = z.object({
  file: z.instanceof(File),
  description: z.string().min(1, { message: 'File Description is required' }),
});

const UploadModal = ({
  opened,
  close,
  fetch,
}: {
  opened: boolean;
  close: () => void;
  fetch: any;
}) => {
  const { handleSubmit, formState, register, setValue } = useForm<
    z.infer<typeof briefcaseSchema>
  >({
    resolver: zodResolver(briefcaseSchema),
  });

  const [upload] = useUploadToBriefcaseMutation();

  const handleUploadFile = async (value: z.infer<typeof briefcaseSchema>) => {
    try {
      await upload(value)
        .unwrap()
        .then(() => {
          NotificationService.successNotification('File Uploaded successfully');
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
      <form onSubmit={handleSubmit(handleUploadFile)}>
        <FileInput
          label="Upload files"
          placeholder="Upload files"
          // multiple
          accept="image/png,image/jpeg,application/pdf"
          {...register(`file`)}
          onChange={(file: File) => setValue(`file`, file)}
        />

        <Textarea
          label="File Description"
          mt={'sm'}
          {...register(`description`)}
        />
        <Flex justify={'flex-end'} mt={'md'}>
          <Button type="submit">Upload</Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default UploadModal;
