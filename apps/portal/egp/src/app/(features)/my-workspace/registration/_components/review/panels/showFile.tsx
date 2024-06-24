import {
  Box,
  Button,
  Flex,
  Image,
  Loader,
  LoadingOverlay,
  Modal,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { logger } from '@megp/core-fe';
import { getCookie } from 'cookies-next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Error from './error.svg';

export const ShowFile = ({
  url,
  filename,
  setStatus,
  zoom,
  download,
}: {
  url: string;
  filename: string;
  setStatus?: Dispatch<SetStateAction<string>>;
  zoom?: boolean;
  download?: boolean;
}) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setStatus && setStatus(loading ? 'loading' : error ? 'error' : 'success');
  }, [error, loading]);

  useEffect(() => {
    const getFile = async () => {
      setPdfData(null);
      setFileContent(null);
      try {
        setLoading(true); // Set loading to true when fetching starts
        const token = getCookie('token');
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching file');
        }
        const fileBlob = await response.blob();
        const blobType = fileBlob.type;

        // Check if the blob is an image or a PDF
        if (
          blobType.includes('image') ||
          (filename && ['png', 'jpg', 'jpeg'].includes(filename.split('.')[1]))
        ) {
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileContent(fileUrl);
        } else if (
          blobType.includes('pdf') ||
          blobType.includes('octet-stream')
        ) {
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
      } finally {
        setLoading(false);
      }
    };

    getFile();
  }, [url, filename]);

  const downloadFile = async () => {
    const token = getCookie('token');
    await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // Replace 'fileName' with the desired name of the downloaded file
        document.body.appendChild(link);
        link.click();
        (link.parentNode as any).removeChild(link);
      })
      .catch((error) => console.error(error));
  };

  if (loading) <Loader size={30} />;
  if (error) {
    return (
      <div>
        <Flex
          direction={'column'}
          justify={'center'}
          className="text-center py-2 text-md"
        >
          <Image src={Error} alt="Error" />
          <Text>
            Looks like something went wrong while loading the file. Double-check
            your connection and try reloading.
          </Text>
        </Flex>
      </div>
    );
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size={'80%'}
        fullScreen
        centered
        title={'Attachment'}
      >
        <Box style={{ height: '92vh' }}>
          {pdfData ? (
            <iframe
              src={`data:application/pdf;base64,${Buffer.from(
                pdfData as any,
              ).toString('base64')}`}
              width="100%"
              height="100%"
              title={filename}
            />
          ) : (
            <Image
              src={fileContent}
              alt={filename}
              className="cursor-pointer "
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </Box>
      </Modal>
      <div
        className="w-full h-full flex gap-2 flex-col items-center justify-center"
        style={{ height: '500px' }}
      >
        {pdfData ? (
          <Box
            className="cursor-pointer"
            onClick={() => open()}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <iframe
              src={`data:application/pdf;base64,${Buffer.from(pdfData).toString(
                'base64',
              )}`}
              width="100%"
              height="100%"
              title={filename}
            />
          </Box>
        ) : fileContent ? (
          <Image
            src={fileContent}
            alt={filename}
            className="cursor-pointer "
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <p>No content available </p>
        )}

        {(pdfData || fileContent) && (
          <>
            <Flex className="w-full" justify={'flex-end'}>
              {zoom && (
                <Button
                  variant="subtle"
                  onClick={() => {
                    return open();
                  }}
                >
                  view full size
                </Button>
              )}
              {download && (
                <Button
                  color="blue"
                  variant="subtle"
                  onClick={() => {
                    return downloadFile();
                  }}
                >
                  Download
                </Button>
              )}
            </Flex>
          </>
        )}
      </div>
    </>
  );
};

// const ImageModal = ({
//   opened,
//   close,
//   url,
// }: {
//   opened: boolean;
//   close: () => void;
//   url: string;
// }) => {
//   return (
//     <Modal
//       opened={opened}
//       onClose={close}
//       size={'80%'}
//       centered
//       title={'Attachment'}
//     >
//       <Image src={url} alt="" />
//     </Modal>
//   );
// };
