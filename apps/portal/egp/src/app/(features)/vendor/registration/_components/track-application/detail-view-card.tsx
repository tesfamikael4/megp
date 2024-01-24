import React from 'react';
import styles from './detail-view-card.module.scss';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Paper,
  Progress,
  Text,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import ProgressBar from './progressBar';
import { useRouter } from 'next/navigation';
import { ApplicationInfo } from '@/models/vendorRegistration';

const callbackURL = (key: string) => {
  if (key == 'GoodsNewRegistration' || key == 'ServicesNewRegistration') {
    return 'new/detail';
  }
  if (key == 'GoodsRenewal' || key == 'ServicesRenewal') {
    return 'renewal/ppda';
  }
  if (key == 'GoodsUpgrade' || key == 'ServiceUpgrade') {
    return 'upgrade/business-areas';
  }
  if (key == 'GoodsInfoChange' || key == 'ServiceInfoChange') {
    return 'info-change';
  }
  if (key == 'preferential-treatment') {
    return 'preferential-treatment';
  }
};

interface Props {
  data: ApplicationInfo;
  close: () => void;
}
const badgeColor: { [key: string]: string } = {
  Rejected: 'red.6',
  Submitted: 'green.8',
  Adjustment: 'yellow.6',
  Completed: 'green.8',
  Pending: 'blue.8',
};
const DetailViewCard: React.FC<Props> = ({ data, close }) => {
  console.log({ data });
  const router = useRouter();
  return (
    <Paper shadow="xs" withBorder className={styles.card}>
      <Box className={styles.cardHeader}>
        <Flex gap={'xs'}>
          <ActionIcon variant="transparent" onClick={close}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Text fz={'sm'}>{data.applicationNumber}</Text>
        </Flex>

        <Badge size="sm" color={badgeColor[data.status]}>
          {data.status}
        </Badge>
      </Box>
      <Box className={styles.cardBody}>
        <ProgressBar instanceId={data.instanceId} />
      </Box>
      <Box className={styles.cardFooter}>
        {data.status === 'Adjustment' && (
          <Button
            onClick={() =>
              router.push(
                `/vendor/registration/${callbackURL(data.BpService.key)}`,
              )
            }
          >
            Adjust
          </Button>
        )}
      </Box>
    </Paper>
  );
};
export default DetailViewCard;
