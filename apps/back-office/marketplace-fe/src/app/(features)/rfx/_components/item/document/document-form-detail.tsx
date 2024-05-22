import {
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  Stack,
  Textarea,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { IconUpload } from '@tabler/icons-react';
import { usePreSignedUrlMutation } from '../../../_api/rfx/sor-document.api';

export function DocumentFormDetail() {
  const { itemId } = useParams();
  const [retrieveNewURL] = usePreSignedUrlMutation();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (file) => {
    try {
      setIsLoading(true);
      await upload(file as unknown as FileList);
    } catch (error) {
      setIsLoading(false);
      logger.log(error);
    }
  };

  const upload = async (files: FileList | null) => {
    if (!files) {
      setIsLoading(false);
      notify('Error', 'No file selected');
      return;
    }

    const fileList = Array.from(files); // Convert FileList to Array
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const url = await retrieveNewURL({
          file: {
            originalname: file.name,
            contentType: file.type,
          },
          itemId: itemId,
        }).unwrap();
        await uploadFile(file, url.presignedUrl);
      } catch (error) {
        setIsLoading(false);
        notify('Error', 'Something went wrong while uploading document');
      }
    }
  };

  const uploadFile = async (file: File, url: string) => {
    try {
      await fetch(url, {
        method: 'PUT',
        body: file,
      });
      notify('Success', 'Document Uploaded Successfully');
      setIsLoading(false);
      close();
    } catch (error) {
      setIsLoading(false);
      notify('Error', 'Something went wrong while uploading document');
      throw error;
    }
  };

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <FileInput
        accept=".pdf"
        multiple
        label="Additional Technical Spec"
        className="my-2"
        leftSection={<IconUpload />}
        onChange={async (files) => {
          await onSubmit(files);
        }}
      />
    </Stack>
  );
}
