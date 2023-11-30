import React from 'react';
import styles from './detail-view-card.module.scss';
import { ActionIcon, Badge, Box, Button, Card, Progress } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import ProgressBar from './progressBar';
import { useRouter } from 'next/navigation';
import { ApplicationInfo } from '@/models/vendorRegistration';

interface Props {
  data: ApplicationInfo;
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
        <Badge size="sm" color={badgeColor[data.status]}>
          {data.status}
        </Badge>
      </Box>
      <Box className={styles.cardBody}>
        <ProgressBar instanceId={data.instanceId} />
      </Box>
      <Box className={styles.cardFooter}>
        {data.status === 'Adjust' && (
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
