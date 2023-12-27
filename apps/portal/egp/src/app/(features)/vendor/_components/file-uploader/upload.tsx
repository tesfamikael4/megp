'use client';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ActionIcon, Flex, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import styles from './upload.module.scss';
import { getCookie } from 'cookies-next';
import { Image } from 'next/dist/client/image-component';

interface FileUploaderProps {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  onChange?: (file: File) => void;
  getImageUrl?: string | null;
  onRemove?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  label,
  placeholder = 'Upload',
  disabled,
  error,
  onChange,
  getImageUrl,
  onRemove,
}) => {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const authToken = getCookie('token');
    function fetchWithAuthentication(url, authToken) {
      const headers = new Headers();
      headers.set('Authorization', `Bearer ${authToken}`);
      return fetch(url, { headers })
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then((objectUrl) => setCurrent(objectUrl));
    }
    if (typeof getImageUrl === 'string') {
      fetchWithAuthentication(getImageUrl, authToken);
    }
    return () => {};
  }, [getImageUrl]);

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
      const selectedFile = e.currentTarget.files[0];
      const convertImageUrl = URL.createObjectURL(selectedFile);

      setCurrent(convertImageUrl);

      if (onChange) {
        onChange(selectedFile);
      }
    }
  };
  const handleRemove = () => {
    setCurrent(null);
  };

  return (
    <>
      <Flex className={styles.root}>
        <Text fw={600} size="sm">
          {label}
        </Text>

        <Flex className={styles.inner}>
          {current ? (
            <Flex className={styles.cardImage}>
              <Image
                src={
                  current ??
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAQAAADa613fAAAAaElEQVR42u3PQREAAAwCoNm/9CL496ABuREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREWkezG8AZQ6nfncAAAAASUVORK5CYII='
                }
                alt="image"
                width={50}
                height={50}
                onLoad={async (p) => {
                  p.currentTarget.classList.add(
                    'animate-pulse',
                    'bg-slate-300',
                  );
                  URL.revokeObjectURL(current);
                }}
                onLoadingComplete={(p) => {
                  p.classList.remove('animate-pulse', 'bg-slate-300');
                }}
              />
              <ActionIcon
                p={0}
                miw={'1px'}
                variant="transparent"
                className={styles.trashIcon}
                onClick={handleRemove}
              >
                <IconTrash size={16} color="red" />
              </ActionIcon>
            </Flex>
          ) : (
            <Flex className={styles.cardAdd} onClick={handleUploadClick}>
              <IconPlus size={18} />
              <Text size="xs">{placeholder}</Text>
            </Flex>
          )}

          <input
            type="file"
            id="file-uploader-input"
            onChange={handleOnChange}
            style={{ display: 'none' }}
          />
        </Flex>
        <Text fz={'xs'} color="red">
          {error}
        </Text>
      </Flex>
    </>
  );
};

export default FileUploader;
