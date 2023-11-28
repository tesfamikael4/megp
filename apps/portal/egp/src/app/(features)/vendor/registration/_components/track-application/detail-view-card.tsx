import React from 'react';
import styles from './detail-view-card.module.scss';
import { ActionIcon, Badge, Box, Button, Card, Progress } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import ProgressBar from './progressBar';
import { Application } from './application-list';
import { useRouter } from 'next/navigation';

interface Props {
  data: Application;
  close: () => void;
}
const badgeColor: { [key: string]: string } = {
  Rejected: 'red.4',
  Submitted: 'blue.4',
  Adjust: 'yellow.4',
  Completed: 'Green.4',
  Pending: 'blue.4',
};
const DetailViewCard: React.FC<Props> = ({ data, close }) => {
  const router = useRouter();
  return (
    <Box className={styles.card}>
      <Box className={styles.cardHeader}>
        <ActionIcon variant="transparent" onClick={close}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Badge size="sm" color={badgeColor[data.serviceStatus]}>
          {data.serviceStatus}
        </Badge>
      </Box>
      <Box className={styles.cardBody}>
        <ProgressBar instanceId={data.trackingNumber} />
      </Box>
      <Box className={styles.cardFooter}>
        {data.serviceStatus === 'Adjust' && (
          <Button
            onClick={() => router.push('/vendor/registration/new/detail')}
          >
            Adjust
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default DetailViewCard;
