import React, { useState } from 'react';
import {
  Text,
  Card,
  Flex,
  Button,
  Avatar,
  Box,
  rgba,
  Modal,
  Stack,
} from '@mantine/core';
import classes from './TenderCard.module.css';
import { IconBookmark, IconTools } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Tender } from '@/models/tender/tender.model';
import Moment from 'moment';
import { RFX } from '@/models/rfx/rfx.model';
import { useDisclosure } from '@mantine/hooks';
import { useLazyGetRfxItemsQuery } from '../../procurement-notice/_api/rfx.api';
import Items from '../../invitations-workspace/prepare-bid/_components/price-schedule/item.component';
import { DetailTable } from '../detail-table/detail-table';
import InvitationDetail from '../../invitations-workspace/prepare-bid/_components/price-schedule/invitation-detail.component';

interface TenderCardProps {
  color?: string;
  tender?: Tender;
  handleViewMore?: () => void;
  handleRegister?: () => void;
  register?: boolean;
  textColor?: string;
}

const TenderCard = ({
  color,
  register,
  textColor,
  tender,
}: TenderCardProps) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/procurement-notice/${tender?.id}`);
  };

  const handleRegister = () => {
    if (tender?.objectType === 'RFX') {
      router.push(`/procurement-notice/rfx/${tender?.id}`);
    } else {
      router.push(`/procurement-notice/tender/${tender?.id}`);
    }
  };

  return (
    <>
      {tender && (
        <Card withBorder radius="md" shadow="xs">
          <Box
            className=" absolute top-0 left-5 rounded-b-lg p-2 py-1"
            c={textColor}
            bg={tender?.objectType === 'RFX' ? 'blue' : 'green'}
            fw={700}
            fz={'xs'}
          >
            12 | Days Left
          </Box>
          {tender && tender.isBookmarked && (
            <Box
              className=" absolute top-0 right-4 rounded-b-lg p-2 py-1 cursor-pointer"
              fz={'xs'}
              c="gray.7"
              bg={rgba('var(--mantine-primary-color-5)', 0.1)}
            >
              <IconBookmark size={28} stroke={1.6} />
            </Box>
          )}
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
                  {tender && tender.name}
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
                  {tender && tender.description}
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
                    {tender && tender.organizationName}
                  </Text>
                  <Box className="flex flex-col gap-0">
                    <Flex align={'center'} className={classes.dateInfo} gap={5}>
                      <Text fw={500} fz={14} lh={'sm'}>
                        Published:
                      </Text>
                      <Text
                        className="text-gray-400"
                        fw={400}
                        fz={14}
                        lh={'sm'}
                      >
                        {' '}
                        {Moment(tender.publishmentDate).format(
                          'MMMM Do YYYY, h:mm:ss a',
                        )}{' '}
                      </Text>
                    </Flex>
                    <Flex align={'center'} className={classes.dateInfo} gap={5}>
                      <Text fw={500} fz={14} lh={'sm'}>
                        Closing:
                      </Text>
                      <Text
                        className="text-gray-400"
                        fw={400}
                        fz={14}
                        lh={'sm'}
                      >
                        {' '}
                        {Moment(tender && tender.closingDate).format(
                          'MMMM Do YYYY, h:mm:ss a',
                        )}{' '}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                <Flex columnGap={'md'} mt={'sm'} justify={'flex-end'}>
                  <Button onClick={handleRegister}>Register</Button>
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
      )}
    </>
  );
};

export default TenderCard;
