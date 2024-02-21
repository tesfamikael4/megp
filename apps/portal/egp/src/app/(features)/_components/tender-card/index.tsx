import React from 'react';
import {
  Text,
  Card,
  useMantineTheme,
  Flex,
  Button,
  Avatar,
  Box,
  Group,
} from '@mantine/core';
import classes from './TenderCard.module.css';
import { IconBookmark, IconHammer, IconTools } from '@tabler/icons-react';

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
    <Card withBorder radius="md" c={'black'}>
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
          color: 'black',
          fontWeight: 700,
          fontSize: theme.fontSizes.xs,
          cursor: 'pointer',
        }}
      >
        <IconBookmark size={30} stroke={1} />
      </div>
      <Box className="flex flex-col">
        <Flex align={'center'} gap={'sm'}>
          <Flex
            direction={'column'}
            className="text-center text-sm"
            visibleFrom="sm"
          >
            <Avatar
              w={{
                xs: 50,
                sm: 50,
                md: 80,
              }}
              h={{ xs: 50, sm: 50, md: 80 }}
              bg={'#F0FFF3'}
              mb={10}
              style={{
                border: '1px solid #A5D2B2',
              }}
            >
              <IconTools color="black" size={30} stroke={1} />
            </Avatar>
            <Text fw={500} fz={'12px'} lh={'12px'}>
              Services
            </Text>
          </Flex>
          <Flex direction={'column'} w={'100%'}>
            <Flex align={'center'} mt={30}>
              <Flex
                direction={'column'}
                className="text-center text-sm"
                hiddenFrom="sm"
              >
                <Avatar
                  w={{
                    xs: 50,
                    sm: 50,
                    md: 80,
                  }}
                  h={{ xs: 50, sm: 50, md: 80 }}
                  bg={theme.colors.green[1]}
                  mb={4}
                  style={{
                    border: '1px solid #A5D2B2',
                  }}
                >
                  <IconTools color="black" size={30} strokeWidth={1} />
                </Avatar>
                <Text fw={500} fz={'xs'} lh={'12px'}>
                  Services
                </Text>
              </Flex>
              <Text
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
            </Flex>

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
                md: '8px',
              }}
            >
              <Text
                className="sm:text-sm lg:text-md"
                fw={500}
                fz={'sm'}
                lh={'md'}
                mb={8}
              >
                Minister of Education
              </Text>
              <Box className="flex flex-col gap-0">
                <Flex
                  align={'center'}
                  columnGap={'sm'}
                  className={classes.dateInfo}
                >
                  <Text fw={500} fz={'sm'} lh={'sm'} mr={'4px'}>
                    Published:
                  </Text>
                  <Text className="text-gray-400" fw={400} fz={'sm'} lh={'sm'}>
                    14-Jan-2024
                  </Text>
                </Flex>
                <Flex
                  align={'center'}
                  columnGap={'sm'}
                  className={classes.dateInfo}
                >
                  <Text fw={500} fz={'sm'} lh={'sm'} mr={'4px'}>
                    Closing:
                  </Text>
                  <Text className="text-gray-400" fw={400} fz={'sm'} lh={'sm'}>
                    14-Jan-2024 3:00 PM
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <Flex columnGap={'md'} mt={'sm'} justify={'flex-end'}>
              {register && <Button>Register</Button>}
              <Button
                variant="outline"
                c={'#1D8E3F'}
                fz={'xs'}
                lh={'sm'}
                className="hover:bg-[#F0FFF3]"
              >
                View More
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Card>
  );
};

export default TenderCard;
