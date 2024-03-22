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
import { useRouter } from 'next/navigation';
import { ApplicationInfo } from '@/models/vendorRegistration';

const callbackURL = (key: string) => {
  if (key == 'NewRegistration') {
    return 'new/detail';
  }
  if (key == 'ProfileUpdate') {
    return 'profile-update';
  }
  if (key == 'Medium' || key == 'Small' || key == ' MIrc') {
    return 'preferential-treatment';
  }
  if (key == 'ibm') {
    return 'preferential-treatment';
  }
  if (key == 'Marginalized_Group') {
    return 'preferential-treatment';
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

  return (
    <Paper shadow="xs" withBorder className={styles.card}>
      <Box className={styles.cardHeader}>
        <Flex gap={'xs'}>
          <Text className="text-md font-semibold text-green-500">
            Adjustment Required
          </Text>
          <Text fz={'sm'}>{data.applicationNumber}</Text>
        </Flex>
      </Box>
      <Box className={styles.cardBody}>Remark: {data.remark}</Box>
      <Box className={styles.cardFooter}>
        {data.status === 'Adjustment' && (
          <Button
            onClick={() => {
              router.push(`/vendor/registration/${callbackURL(data.key)}`);
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
