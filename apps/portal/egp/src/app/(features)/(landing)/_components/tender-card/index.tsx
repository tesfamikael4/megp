import React from 'react';
import {
  Text,
  Card,
  useMantineTheme,
  Flex,
  Button,
  Avatar,
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
          left: theme.spacing.md,
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
          right: theme.spacing.md,
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
            <Avatar w={80} h={80} bg={theme.colors.green[1]} mb={10}>
              <IconHammer color="white" size={30} />
            </Avatar>
            <Text fw={500} fz={'xs'} lh={'12px'}>
              Services
            </Text>
          </Text>
          <Flex direction={'column'} rowGap={'xs'}>
            <Text className={classes.lead} mt={30} fz={'md'} lh={'24px'}>
              Computer services and devices, Lorem Ipsum Computer services and
              devices.
            </Text>
            <Text c="dimmed" fz={'sm'} lh={'20px'}>
              Lorem ipsum dolor sit amet, consectetur lorem adipiscing elit. Nam
              hendrerit nisi sed sollicitud
            </Text>
            <Flex
              className="xs:flex-col md:flex-row flex-col justify-between "
              direction={'column'}
            >
              <Text className="font-extrabold">Minister of Education</Text>
              <Flex align={'center'} justify={'space-between'}>
                <Flex align={'center'} columnGap={'sm'} fz={'md'} lh={'20px'}>
                  <Text fw={500}>Published:</Text>
                  <Text className="text-gray-400" fw={400}>
                    {' '}
                    14-Jan-2024
                  </Text>
                </Flex>
                <Flex align={'center'} fz={'md'} lh={'20px'} columnGap={'sm'}>
                  <Text fw={500}>Closing:</Text>
                  <Text className="text-gray-400" fw={400}>
                    {' '}
                    14-Jan-2024 3:00 PMT
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex className={classes.ring} columnGap={'md'} mt={'sm'}>
              {register && <Button>Register</Button>}
              <Button variant="outline">View More</Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default TenderCard;
