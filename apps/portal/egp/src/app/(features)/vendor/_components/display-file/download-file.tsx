'use-client';

import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export const DownloadFile = ({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFile = async () => {
      try {
        setIsLoading(true);
        const token = getCookie('token');
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          setIsLoading(false);
          throw new Error('Error fetching file');
        }
        const fileBlob = await response.blob();
        const blobType = fileBlob.type;

        // Check if the blob is an image or a PDF
        if (blobType.includes('pdf')) {
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileContent(fileUrl);
        }
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        // logger.log(err);
      }
    };

    getFile();
  }, [url]);

  if (error) {
    return (
      <Button
        className="w-full rounded"
        leftSection={<IconDownload size={13} />}
        disabled
      >
        Download
      </Button>
    );
  }
  return (
    <>
      {fileContent ? (
        <Button
          component="a"
          variant="transparent"
          className="w-full rounded"
          leftSection={<IconDownload size={13} />}
          download={filename}
          href={fileContent}
          loading={isLoading}
        >
          Download
        </Button>
      ) : (
        <Button
          className="w-full rounded"
          variant="transparent"
          leftSection={<IconDownload size={13} />}
          loading={isLoading}
          disabled
        >
          Download
        </Button>
      )}
    </>
  );
};
