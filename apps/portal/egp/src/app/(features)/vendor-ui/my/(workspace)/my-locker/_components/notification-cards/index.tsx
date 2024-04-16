import React from 'react';
import { Text, Flex, Card, Box, Anchor } from '@mantine/core';
import { IconCheck, IconAlertCircle, IconX } from '@tabler/icons-react';
import { Notification } from '../../_model/notification';
import { IconAlertSmall } from '@tabler/icons-react';

const NotificationCard: React.FC<Notification> = ({
  organizationName,
  description,
  type,
}) => {
  let icon;
  let color;

  switch (type) {
    case 'success':
      icon = <IconCheck stroke={4} size={12} color="#40C057" />;
      color = '#40C057';
      break;
    case 'warning':
      icon = <IconAlertSmall stroke={2} size={18} color="#FF2A2A" />;
      color = '#FF2A2A';
      break;
    default:
      icon = null;
      color = '#FF2A2A';
  }

  return (
    <Card
      radius={'sm'}
      shadow={'xs'}
      className={`bg-white flex w-full p-4 gap-2 ${color}`}
    >
      <Flex className="w-full gap-2 h-full">
        {icon && (
          <Box
            style={{
              borderColor: color,
            }}
            className={`w-5 h-5 flex items-center justify-center border-2 rounded-full border-[${color}] border-[${color}]`}
          >
            {icon}
          </Box>
        )}
        <Flex className="flex-col gap-1 ">
          <Flex className="gap-3">
            <Text fw={600} fz={12} c={'gray.6'}>
              Organization Name
            </Text>
            <Text fw={600} fz={12} c={'gray.6'}>
              .
            </Text>
            <Text fw={600} fz={12} c={'gray.6'}>
              Now
            </Text>
          </Flex>
          <Flex>
            <Text fw={500} fz={14}>
              {organizationName}
            </Text>
          </Flex>
          <Flex>
            <Text fw={500} fz={12} c={'gray.6'}>
              {description}
            </Text>
          </Flex>
        </Flex>
        <Flex className=" flex-grow justify-end items-end">
          <Anchor fz={12} fw={600} c={'primary.7'}>
            View More
          </Anchor>
        </Flex>
      </Flex>
    </Card>
  );
};

export default NotificationCard;
