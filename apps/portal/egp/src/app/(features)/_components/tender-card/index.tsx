import React from 'react';
import {
  Text,
  Card,
  useMantineTheme,
  Flex,
  Button,
  Avatar,
  Box,
} from '@mantine/core';
import classes from './TenderCard.module.css';
import { IconBookmark, IconHammer } from '@tabler/icons-react';

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
    <Card withBorder radius="md">
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
      <Box className="flex flex-col">
        <Flex align={'center'} gap={'sm'}>
          <Text className="text-center text-sm">
            <Avatar
              w={{
                xs: 50,
                sm: 50,
                md: 80,
              }}
              h={{ xs: 50, sm: 50, md: 80 }}
              bg={theme.colors.green[1]}
              mb={10}
            >
              <IconHammer color="white" size={30} />
            </Avatar>
            <Text fw={500} fz={'xs'} lh={'12px'}>
              Services
            </Text>
          </Text>
          <Flex direction={'column'} w={'100%'}>
            <Text
              mt={30}
              fz={'sm'}
              lh={{
                xs: 'xs',
                sm: 'xs',
                md: '24px',
              }}
              className="font-semibold"
            >
              Computer services and devices, Lorem Ipsum Computer services and
              devices.
            </Text>

            <Text
              c="dimmed"
              fz={'xs'}
              lh={{
                xs: '12px',
                sm: '12px',
                md: '20px',
              }}
            >
              Lorem ipsum dolor sit amet, consectetur lorem adipiscing elit. Nam
              hendrerit nisi sed sollicitud
            </Text>
            <Flex
              direction={'column'}
              mt={{
                xs: '4px',
                sm: '4px',
                md: 'sm',
              }}
            >
              <Text className="sm:text-sm lg:text-md" fw={500}>
                Minister of Education
              </Text>
              <Box className="flex flex-col  sm:flex-row sm:items-center sm:justify-between">
                <Flex
                  align={'center'}
                  columnGap={'sm'}
                  fz={'md'}
                  lh={'20px'}
                  className={classes.dateInfo}
                >
                  <Text fw={500}>Published:</Text>
                  <Text className="text-gray-400" fw={400}>
                    14-Jan-2024
                  </Text>
                </Flex>
                <Flex
                  align={'center'}
                  fz={'md'}
                  lh={'20px'}
                  columnGap={'sm'}
                  className={classes.dateInfo}
                >
                  <Text fw={500}>Closing:</Text>
                  <Text className="text-gray-400" fw={400}>
                    14-Jan-2024
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <Flex columnGap={'md'} mt={'sm'} justify={'flex-end'}>
              {register && <Button>Register</Button>}
              <Button variant="outline">View More</Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Card>
  );
};

export default TenderCard;
