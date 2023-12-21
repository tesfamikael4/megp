'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Flex, Image, Progress, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import styles from './upload.module.scss';

import { getCookie } from 'cookies-next';
import { getFile, uploadFile } from './hooks';
import { NotificationService } from '../notification';

interface FileUploaderProps {
  serverPostUrl: string;
  serverGetUrl: string;
  id: string;
  label: string;
  placeholder: string;
  metaData: any;
  storeId: string | undefined;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  label,
  placeholder = 'Upload',
  metaData,
  storeId,
  serverPostUrl,
  serverGetUrl,
  disabled,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    return () => {
      getFile(serverGetUrl).then((url) => {
        if (url !== null) {
          setImageUrl(url);
        } else {
          console.error('Error in getFile');
        }
      });
    };
  }, []);

  const [current, setCurrent] = useState<File | null>();
  const previews = (file: File) => {
    const convertImageUrl = URL.createObjectURL(file);

    return (
      <Image
        maw={50}
        src={convertImageUrl}
        onLoad={() => URL.revokeObjectURL(convertImageUrl)}
        radius="md"
        alt=""
      />
    );
  };

  const handleUploadClick = () => {
    const fileInput = document.getElementById(
      'file-uploader-input',
    ) as HTMLInputElement | null;

    // Check if the file input element exists
    if (fileInput) {
      // Trigger the click event
      fileInput.click();
    }
  };
  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (
      e.currentTarget.files &&
      e.currentTarget.files?.length > 0 &&
      e.currentTarget.files[0]
    ) {
      console.log(typeof e.currentTarget.files[0]);
      console.log(e.currentTarget.files[0]);

      const formData = new FormData();
      formData.append('attachmentUrl', e.currentTarget.files[0]);
      // formData.append('attachmentUrl', e.currentTarget.files[0]);
      setCurrent(e.currentTarget.files[0]);
      uploadFile(
        serverPostUrl,
        formData,
        createProgressCallback(setUploadProgress),
      )
        .then((result) => {
          if (result.success) {
            getFile(serverGetUrl).then((url) => {
              if (url !== null) {
                setImageUrl(url);
              } else {
                NotificationService.requestErrorNotification(
                  'error on uploading file',
                );
                console.error('Error in getFile');
              }
            });
          } else {
            console.error('Error in getFile');
            NotificationService.requestErrorNotification(
              'error on uploading file',
            );
          }
        })
        .finally(() => {
          // setUploadProgress(0); // Reset progress after completion
        });
    }
  };
  return (
    <>
      <Flex className={styles.root}>
        <Text fw={600} size="sm">
          {label}
        </Text>

        <Flex className={styles.inner}>
          {current && (
            <Flex className={styles.cardImage}>{previews(current)}</Flex>
          )}
          <input
            type="file"
            id="file-uploader-input"
            onChange={handleOnChange}
            style={{ display: 'none' }}
          />
          {!current && imageUrl && (
            <Image maw={50} src={imageUrl} radius="md" alt="" />
          )}
          <Flex className={styles.cardAdd} onClick={handleUploadClick}>
            <IconPlus size={18} />
            <Text size="xs">{placeholder}</Text>
          </Flex>
        </Flex>
        <Progress value={uploadProgress} />
      </Flex>
    </>
  );
};
const createProgressCallback =
  (setUploadProgress: React.Dispatch<React.SetStateAction<number>>) =>
  (progressEvent: ProgressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded / progressEvent.total) * 100,
    );
    setUploadProgress(progress);
  };
export default FileUploader;
