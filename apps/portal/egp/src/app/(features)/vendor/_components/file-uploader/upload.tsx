'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ActionIcon, Flex, Image, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import styles from './upload.module.scss';

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
      const selectedFile = e.currentTarget.files[0];
      setCurrent(selectedFile);

      if (onChange) {
        onChange(selectedFile);
      }
    }
  };
  const handleRemove = () => {
    if (getImageUrl && onRemove) {
      onRemove();
    }
    setCurrent(null);
  };

  return (
    <>
      <Flex className={styles.root}>
        <Text fw={600} size="sm">
          {label}
        </Text>

        <Flex className={styles.inner}>
          {getImageUrl ? (
            <Flex className={styles.cardImage}>
              <Image maw={50} src={getImageUrl} radius="md" alt="" />
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
          ) : current ? (
            <Flex className={styles.cardImage}>
              {current && previews(current)}
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
            ''
          )}

          <input
            type="file"
            id="file-uploader-input"
            onChange={handleOnChange}
            style={{ display: 'none' }}
          />
          {current || getImageUrl ? (
            ''
          ) : (
            <Flex className={styles.cardAdd} onClick={handleUploadClick}>
              <IconPlus size={18} />
              <Text size="xs">{placeholder}</Text>
            </Flex>
          )}
        </Flex>
        <Text fz={'xs'} color="red">
          {error}
        </Text>
      </Flex>
    </>
  );
};

export default FileUploader;
