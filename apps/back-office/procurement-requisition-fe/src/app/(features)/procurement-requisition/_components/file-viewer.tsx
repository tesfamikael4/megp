'use client';
import { Image, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { logger } from '@megp/core-fe';
import { useEffect, useState } from 'react';

export const FileViewer = ({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null); // Use null as initial state
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFile = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error fetching file');
        }
        const fileBlob = await response.blob();
        const blobType = fileBlob.type;

        // Check if the blob is an image or a PDF
        if (blobType.includes('image')) {
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileContent(fileUrl);
        } else if (blobType.includes('pdf')) {
          const arrayBuffer = await new Promise<ArrayBuffer>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                  resolve(reader.result);
                } else {
                  reject(new Error('Failed to convert Blob to ArrayBuffer'));
                }
              };
              reader.onerror = () => {
                reject(new Error('Error reading Blob as ArrayBuffer'));
              };
              reader.readAsArrayBuffer(fileBlob);
            },
          );
          setPdfData(arrayBuffer);
        } else if (blobType.includes('octet-stream')) {
          const arrayBuffer = await new Promise<ArrayBuffer>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                  resolve(reader.result);
                } else {
                  reject(new Error('Failed to convert Blob to ArrayBuffer'));
                }
              };
              reader.onerror = () => {
                reject(new Error('Error reading Blob as ArrayBuffer'));
              };
              reader.readAsArrayBuffer(fileBlob);
            },
          );
          setPdfData(arrayBuffer);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        logger.log(err);
      }
    };

    getFile();
  }, [url]);

  if (error) {
    return (
      <div>
        <p className="text-center py-2 text-md">{`
    Looks like something went wrong while loading the file.
    Double-check your connection and try reloading`}</p>
      </div>
    );
  }

  return (
    <>
      <ImageModal opened={opened} close={close} url={fileContent as string} />
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ height: '500px' }}
      >
        {pdfData ? (
          <iframe
            src={`data:application/pdf;base64,${Buffer.from(pdfData).toString(
              'base64',
            )}`}
            width="100%"
            height="100%"
            title={filename}
          />
        ) : fileContent ? (
          <Image
            src={fileContent}
            alt={filename}
            className="cursor-pointer "
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onClick={() => open()}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

const ImageModal = ({
  opened,
  close,
  url,
}: {
  opened: boolean;
  close: () => void;
  url: string;
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      size={'80%'}
      centered
      title={'Attachment'}
    >
      <Image src={url} alt="" />
    </Modal>
  );
};
