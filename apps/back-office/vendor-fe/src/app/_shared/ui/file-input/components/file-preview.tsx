import { Button, Image, Modal } from '@mantine/core';
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconFileDownload,
} from '@tabler/icons';
import * as React from 'react';
import { useState } from 'react';
import { FileType } from '../model/file-type';
import { getFileType } from '../utilities/get-file-type';

/* Component props */
export interface FilePreviewProps {
  modalTitle: string;
  fileUrl: string;
  fileName: string;
  modalSize?: 'xs' | 'sm' | 'xl' | 'lg';
  description?: string;
}

/* Component definition */
export function FilePreview(props: FilePreviewProps) {
  /* Component states */
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [screenSize, setScreenSize] = useState<string>(
    props?.modalSize ? props?.modalSize : '40%',
  );
  /* Variables */
  const fileType: FileType = getFileType(props?.fileName);
  /* Event handlers */
  const handleFileResize = () => {
    if (screenSize === '100%') {
      setScreenSize(props?.modalSize ? props?.modalSize : '40%');
    } else if (screenSize !== '100%') {
      setScreenSize('100%');
    }
  };

  const onModalClose = () => {
    setIsModalOpened(false);
  };

  const onPreviewClick = () => {
    setIsModalOpened(true);
  };

  return (
    <>
      <span
        className="ml-2 text-blue-500 hover:cursor-pointer hover:underline"
        onClick={onPreviewClick}
      >
        Preview
      </span>
      <Modal
        opened={isModalOpened}
        onClose={onModalClose}
        zIndex={10000}
        title={`${props?.modalTitle ?? 'File Details'}`}
        centered
        size={screenSize}
        radius={'md'}
        styles={{
          header: {
            borderBottom: '2px solid rgb(229 231 235)',
          },
          title: {
            color: 'rgb(0,0,0)',
            fontWeight: 'bold',
          },

          inner: {
            ...(screenSize === '100%' && {
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              overflow: 'scroll',
              width: '100%',
            }),
          },
        }}
      >
        {
          <div className="mb-2 p-2">
            {fileType === 'image' && (
              <div className="bg-gray-100 p-4">
                <Image
                  src={props?.fileUrl}
                  alt="image"
                  height={'500px'}
                  width={screenSize == '40%' ? '600px' : '100%'}
                />
              </div>
            )}

            {fileType === 'video' && (
              <video controls height={'500px'} width={'600px'} autoPlay>
                <source
                  src={props?.fileUrl}
                  type={`${fileType}/${props?.fileName?.split('.').pop()}`}
                />
              </video>
            )}

            {fileType === 'audio' && (
              <audio controls autoPlay muted>
                <source
                  src={props?.fileUrl}
                  type={`${fileType}/${props?.fileName?.split('.').pop()}`}
                />
              </audio>
            )}
            {fileType === 'pdf' && (
              <iframe
                title="pdf viewer"
                src={`${props?.fileUrl}`}
                height="500px"
                width="100%"
                loading="lazy"
              ></iframe>
            )}
            {fileType === 'other' && (
              <a
                className="flex items-center"
                href={props?.fileUrl}
                download
                target="_blank"
                rel="noreferrer"
              >
                <IconFileDownload size={20} className={'flex'} />
                <span className="ml-2 text-blue-500 hover:underline">
                  Download
                </span>
              </a>
            )}
          </div>
        }
        <div className="flex justify-end">
          <Button
            className="mx-1 rounded bg-primary px-6 text-white focus:outline-none"
            onClick={onModalClose}
          >
            Close
          </Button>
          {fileType === 'image' || fileType === 'pdf' ? (
            <Button
              className="mx-1 rounded bg-primary px-6 text-white focus:outline-none"
              onClick={handleFileResize}
              leftIcon={
                screenSize === '100%' ? (
                  <IconArrowsMinimize />
                ) : (
                  <IconArrowsMaximize />
                )
              }
            ></Button>
          ) : (
            ''
          )}
        </div>
      </Modal>
    </>
  );
}

export default FilePreview;
