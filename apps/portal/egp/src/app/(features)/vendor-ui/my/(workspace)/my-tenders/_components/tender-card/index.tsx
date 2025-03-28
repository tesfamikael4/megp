import React from 'react';
import { Text, Card, Flex, Button, Avatar, Box, rgba } from '@mantine/core';
import classes from './TenderCard.module.css';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconTools,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const handleNavigation = () => {
    router.push('/vendor/my-tenders/guarantee');
  };
  return (
    <Card withBorder radius="md" shadow="xs">
      <Box
        className=" absolute top-0 left-5 rounded-b-lg p-2 py-1"
        c={textColor}
        bg={color}
        fw={700}
        fz={'xs'}
      >
        12 | Days Left
      </Box>
      <Box
        className=" absolute top-0 right-4 rounded-b-lg p-2 py-1 cursor-pointer"
        fz={'xs'}
        c="primary.4"
        bg={rgba('var(--mantine-primary-color-5)', 0.1)}
      >
        <IconBookmarkFilled size={28} stroke={1.6} />
      </Box>
      <Box className="flex flex-col" c={'black'}>
        <Flex align={'center'} gap={'sm'}>
          <Flex mt={30} direction={'column'} w={'100%'} gap={8}>
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
              gap={5}
            >
              <Text
                className="sm:text-sm lg:text-md"
                fw={500}
                fz={'sm'}
                lh={'md'}
                mb={{
                  base: 4,
                  md: 8,
                }}
              >
                Minister of Education
              </Text>
              <Box className="flex flex-col gap-0">
                <Flex align={'center'} className={classes.dateInfo} gap={5}>
                  <Text fw={500} fz={14} lh={'sm'}>
                    Published:
                  </Text>
                  <Text className="text-gray-400" fw={400} fz={14} lh={'sm'}>
                    14-Jan-2024
                  </Text>
                </Flex>
                <Flex align={'center'} className={classes.dateInfo} gap={5}>
                  <Text fw={500} fz={14} lh={'sm'}>
                    Closing:
                  </Text>
                  <Text className="text-gray-400" fw={400} fz={14} lh={'sm'}>
                    14-Jan-2024 3:00 PM
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <Flex columnGap={'md'} mt={'sm'} justify={'flex-end'}>
              <Button>Bid Now</Button>
              <Button
                variant="outline"
                fz={'xs'}
                lh={'sm'}
                className="hover:bg-[var(--button-hover)]"
                onClick={handleNavigation}
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
