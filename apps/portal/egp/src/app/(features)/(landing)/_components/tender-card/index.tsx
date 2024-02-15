import React from 'react';
import {
  Text,
  Card,
  RingProgress,
  Group,
  useMantineTheme,
  Flex,
  Button,
  Avatar,
  Box,
  MantineThemeColors,
  MantineColorsTuple,
} from '@mantine/core';
import classes from './StatsRingCard.module.css';
import { IconBookmark, IconHammer } from '@tabler/icons-react';

const stats = [
  { value: 447, label: 'Remaining' },
  { value: 76, label: 'In progress' },
];

interface TenderCardProps {
  color: string;
  title?: string;
  description?: string;
  publishedDate?: Date;
  expiredDate?: Date;
  handleViewMore?: () => void;
  handleRegister?: () => void;
  register?: boolean;
  textColor?: string;
}
const TenderCard = ({ color, register, textColor }: TenderCardProps) => {
  const theme = useMantineTheme();

  return (
    <Card withBorder p="md" radius="md" className={classes.card}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: theme.spacing.xl,
          background: color,
          padding: '4px 12px',
          borderBottomLeftRadius: theme.radius.md,
          borderBottomRightRadius: theme.radius.md,
          color: textColor ?? theme.white,
          fontWeight: 700,
          fontSize: theme.fontSizes.xs,
        }}
      >
        12 | Days Left
      </div>
      {/* bookmark */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: theme.spacing.xl,
          background: '#F0FFF3',
          padding: '4px 12px',
          borderBottomLeftRadius: theme.radius.md,
          borderBottomRightRadius: theme.radius.md,
          color: 'gray',
          fontWeight: 700,
          fontSize: theme.fontSizes.xs,
          cursor: 'pointer',
        }}
      >
        <IconBookmark size={30} stroke={1.5} />
      </div>
      <Flex direction={'column'} className={classes.inner}>
        <Flex align={'center'} gap={'lg'}>
          <Text className="text-center text-sm">
            <Avatar w={48} h={48} bg={theme.colors.green[1]} mb={10}>
              <IconHammer color="white" size={30} />
            </Avatar>
            Services
          </Text>
          <Flex direction={'column'} rowGap={'xs'}>
            <Text className={classes.lead} mt={30}>
              Computer services and devices, Lorem Ipsum Computer services and
              devices.
            </Text>
            <Text fz="xs" c="dimmed">
              Lorem ipsum dolor sit amet, consectetur lorem adipiscing elit. Nam
              hendrerit nisi sed sollicitud
            </Text>
            <Flex className="xs:flex-col md:flex-row flex-col justify-between ">
              <Flex direction={'column'}>
                <Text fz="xs" className="font-extrabold">
                  Minister of Education
                </Text>
                <Text fz="xs" className="font-bold">
                  Published
                  <span className="text-gray-400">: 14-Jan-2024</span>
                </Text>
              </Flex>
              <Text fz="xs" className="mt-auto font-bold">
                Closing
                <span className="text-gray-400">: 14-Jan-2024 3:00 PM</span>
              </Text>
            </Flex>
            <Flex className={classes.ring} columnGap={'md'} mt={'sm'}>
              {register && <Button>Register</Button>}
              <Button variant="outline" className="bg-green-50">
                View More
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default TenderCard;
