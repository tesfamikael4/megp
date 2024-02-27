'use client';

import React, { useCallback } from 'react';
import styles from './detail-view-card.module.scss';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Paper,
  Text,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import ProgressBar from './progressBar';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApplicationInfo } from '@/models/vendorRegistration';

const callbackURL = (key: string) => {
  if (key == 'GoodsNewRegistration' || key == 'ServicesNewRegistration') {
    return 'new/detail';
  }
  if (key == 'ProfileUpdate') {
    return 'profile-update';
  }
  if (key == 'Medium' || key == 'Small' || key == ' MIrc') {
    return 'msme';
  }
  if (key == 'ibm') {
    return 'ibm';
  }
};

interface Props {
  data: ApplicationInfo;
  close: () => void;
}
const badgeBGColor: { [key: string]: string } = {
  Rejected: `red.0`,
  Submitted: `blue.0`,
  Adjustment: `yellow.0`,
  Completed: `green.0`,
  Pending: `blue.0`,
  Outdated: `orange.0`,
};
const badgeTextColor: { [key: string]: string } = {
  Rejected: `red.6`,
  Submitted: `blue.6`,
  Adjustment: `yellow.6`,
  Completed: `green.6`,
  Pending: `blue.6`,
  Outdated: `orange.6`,
};
const DetailViewCard: React.FC<Props> = ({ data, close }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  return (
    <Paper shadow="xs" withBorder className={styles.card}>
      <Box className={styles.cardHeader}>
        <Flex gap={'xs'}>
          <ActionIcon variant="transparent" onClick={close}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Text fz={'sm'}>{data.applicationNumber}</Text>
        </Flex>
        <Badge
          size="sm"
          color={badgeBGColor[data.status]}
          className={'rounded-none flex items-center p-1.5'}
        >
          <Box c={badgeTextColor[data.status]}>{data.status}</Box>
        </Badge>
      </Box>
      <Box className={styles.cardBody}>
        <ProgressBar instanceId={data.instanceId} />
      </Box>
      <Box className={styles.cardFooter}>
        {data.status === 'Adjustment' && (
          <Button
            onClick={() => {
              router.push(
                `/vendor/registration/${callbackURL(data.BpService.key)}?${createQueryString(
                  'flag',
                  'adjustment',
                )}`,
              );
            }}
          >
            Adjust
          </Button>
        )}
      </Box>
    </Paper>
  );
};
export default DetailViewCard;
