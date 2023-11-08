'use client';
import React, { useEffect, useState } from 'react';
import { Flex, Image, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DashboardModal } from '@uppy/react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import Webcam from '@uppy/webcam';
import DefaultStore from '@uppy/store-default';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import styles from './uppyDashboard.module.scss';

interface UppyDashboardProps {
  tusServerPostUrl: string;
  tusServerGetUrl: string;
  id: string;
  label: string;
  placeholder: string;
  metaData: any;
  storeId: string | undefined;
}

const UppyAttachmentDashboard: React.FC<UppyDashboardProps> = ({
  id,
  label,
  placeholder = 'Upload',
  metaData,
  storeId,
  tusServerPostUrl,
  tusServerGetUrl,
}) => {
  const previews = (file: File) => {
    const imageUrl = URL.createObjectURL(file);

    return (
      <Image
        maw={50}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        radius="md"
        alt=""
      />
    );
  };
  const [showUppyModal, setShowUppyModal] = useState(false);
  const [uppy, setUppy] = useState<Uppy | null>(null);

  useEffect(() => {
    const newUppy = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
      },
      autoProceed: false,
      store: new DefaultStore(),
    })
      .use(Webcam)
      .use(Tus, {
        endpoint: tusServerPostUrl,
      });

    newUppy.on('upload-success', (file: any) => {
      newUppy.setState(file);
    });

    newUppy.setMeta(metaData);

    setUppy(newUppy);

    return () => {
      newUppy.close();
    };
  }, [tusServerPostUrl]);
  return (
    <>
      {uppy && (
        <>
          <DashboardModal
            id={id}
            open={showUppyModal}
            uppy={uppy}
            proudlyDisplayPoweredByUppy={false}
            showNativeVideoCameraButton={false}
            closeModalOnClickOutside={true}
            disablePageScrollWhenModalOpen={true}
            browserBackButtonClose={true}
            onRequestClose={() => setShowUppyModal(false)}
          />

          <Flex className={styles.root}>
            <Text fw={600} size="sm">
              {label}
            </Text>

            <Flex className={styles.inner}>
              {uppy.getState().data && (
                <Flex className={styles.cardImage}>
                  {previews(uppy.getState().data)}
                </Flex>
              )}
              {storeId && (
                <Image
                  maw={50}
                  src={`${tusServerGetUrl}${storeId}`}
                  radius="md"
                  alt=""
                />
              )}
              <Flex
                className={styles.cardAdd}
                onClick={() => setShowUppyModal(true)}
              >
                <IconPlus size={18} />
                <Text size="xs">{placeholder}</Text>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};

export default UppyAttachmentDashboard;
