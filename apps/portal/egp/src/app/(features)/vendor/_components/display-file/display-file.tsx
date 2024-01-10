'use-client';

import { Loader } from '@mantine/core';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export const DisplayFile = ({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) => {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null); // Use null as initial state
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFile = async () => {
      try {
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
        // logger.log(err);
      }
    };

    getFile();
  }, [url]);

  if (error) {
    return (
      <div>
        <p className="text-center py-2 ">{`
    Looks like something went wrong while loading the file.
    Double-check your connection and try reloading`}</p>
        ;
      </div>
    );
  }
  return (
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
        <img
          src={fileContent}
          alt={filename}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};
