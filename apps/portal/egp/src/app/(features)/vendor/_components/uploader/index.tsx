'use client';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ActionIcon, Button, Flex, Image, Modal, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import styles from './upload.module.scss';
import { getCookie } from 'cookies-next';
import { useDisclosure } from '@mantine/hooks';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    const authToken = getCookie('token');

    function fetchWithAuthentication(url, authToken) {
      const headers = new Headers();
      headers.set('Authorization', `Bearer ${authToken}`);
      return fetch(url, { headers })
        .then((response) => {
          setSelectedFile(response as any);
          return response.blob();
        })
        .then((blob) => URL.createObjectURL(blob))
        .then((objectUrl) => setCurrent(objectUrl));
    }

    if (typeof getImageUrl === 'string') {
      fetchWithAuthentication(getImageUrl, authToken);
    }

    return () => {};
  }, [getImageUrl]);

  const handleUploadClick = () => {
    const fileInput = document.getElementById(id) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.click();
    }
  };

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (
      e.currentTarget.files &&
      e.currentTarget.files.length > 0 &&
      e.currentTarget.files[0]
    ) {
      const newSelectedFile = e.currentTarget.files[0];

      if (newSelectedFile.type.startsWith('image/')) {
        // Handle image preview
        const convertImageUrl = URL.createObjectURL(newSelectedFile);

        setSelectedFile(newSelectedFile);
        setCurrent(convertImageUrl);

        if (onChange) {
          onChange(newSelectedFile);
        }
      } else if (newSelectedFile.type === 'application/pdf') {
        // Handle PDF preview
        const reader = new FileReader();
        setIsPdf(true);

        reader.onload = (event) => {
          const pdfUrl = event.target?.result as string;

          setSelectedFile(newSelectedFile);
          setCurrent(pdfUrl);

          if (onChange) {
            onChange(newSelectedFile);
          }
        };

        reader.readAsDataURL(newSelectedFile);
      } else {
        // Handle other file types (you can customize this part)
        console.log('Preview not available for this file type.');
      }
    }
  };

  const handleRemove = () => {
    setCurrent(null);
    setSelectedFile(null);
    onRemove && onRemove();
  };

  const [showPreview, setShowPreview] = useState(false);
  const [opened, { close, open }] = useDisclosure(false);

  useEffect(() => {
    if ((selectedFile as any)?.url?.endsWith('.pdf')) setIsPdf(true);
  }, [(selectedFile as any)?.url]);

  return (
    <>
      {current && (
        <FilePreview
          opened={opened}
          close={close}
          url={current}
          isPdf={isPdf}
        />
      )}
      <Flex className={styles.root}>
        <Text fw={600} size="sm">
          {label}
        </Text>

        <label
          htmlFor={id}
          className={`bg-white text-black text-base 
                    rounded w-60 h-30 py-2 flex flex-col items-center 
                    justify-center cursor-pointer border-2
                    border-dashed ${error ? 'border-red-500' : 'border-gray-300'} font-[sans-serif] relative`}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          {current ? (
            <Flex className={styles.cardImage}>
              {selectedFile &&
              (selectedFile.type.startsWith('image/') ||
                !(selectedFile as any)?.url?.endsWith('.pdf')) ? (
                <Image
                  id={id}
                  src={current}
                  alt="image"
                  width={100}
                  height={100}
                  onLoad={(p) => {
                    p.currentTarget.classList.add(
                      'animate-pulse',
                      'bg-slate-300',
                    );
                  }}
                />
              ) : (
                <div>
                  {selectedFile &&
                  (selectedFile.type === 'application/pdf' ||
                    (selectedFile as any)?.url?.endsWith('.pdf')) ? (
                    <img
                      src="/perago.png" // Specify the path to your PDF placeholder image
                      alt="pdf-placeholder"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <p>Preview not available for this file type.</p>
                  )}
                </div>
              )}
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
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 mb-2 fill-black"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              {placeholder}
              <input
                type="file"
                id={id}
                className="hidden"
                onChange={handleOnChange}
              />
              <p className="text-xs text-gray-400 mt-2">PNG, JPG or pdf.</p>
            </>
          )}
          {showPreview && selectedFile && (
            <Flex className={styles.preview} justify={'flex-end'}>
              <Button variant="subtle" onClick={() => open()}>
                Preview
              </Button>
            </Flex>
          )}
        </label>
        <Text fz={'xs'} color="red">
          {error && error}
        </Text>
      </Flex>
    </>
  );
};

export default FileUploader;

const FilePreview = ({
  opened,
  close,
  url,
  isPdf,
}: {
  opened: boolean;
  close: () => void;
  url: string;
  isPdf: boolean;
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      size={'80%'}
      centered
      title={'Attachment'}
    >
      {isPdf ? (
        <embed src={url} type="application/pdf" width="100%" height="500px" />
      ) : (
        <Image src={url} alt="" width={'100%'} height={'100%'} />
      )}
    </Modal>
  );
};
