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
import { usePreSignedUrlMutation } from '../../../_api/item/sor-document.api';

interface DocumentFormDetailProps {
  returnFunction: () => void;
}
export function DocumentFormDetail({
  returnFunction,
}: DocumentFormDetailProps) {
  const { itemId } = useParams();
  const [file, setFile] = useState<File[]>();
  const { register, handleSubmit } = useForm();
  const [retrieveNewURL] = usePreSignedUrlMutation();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (document) => {
    try {
      setIsLoading(true);
      await upload(file as unknown as FileList, document.description);
      returnFunction();
    } catch (error) {
      setIsLoading(false);
      logger.log(error);
    }
  };

  const upload = async (files: FileList | null, description: string) => {
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
          description: description,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea
          label="Description"
          {...register('description')}
          required
          withAsterisk
        />

        <FileInput
          accept=".pdf"
          multiple
          label="Document"
          withAsterisk
          className="my-2"
          leftSection={<IconUpload />}
          onChange={(files) => setFile(files)}
        />
        <Group gap="md" justify="end">
          <Button
            leftSection={<IconUpload size={18} />}
            type="submit"
            loading={isLoading}
          >
            Upload
          </Button>
          <Button variant="outline" onClick={close}>
            Close
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
