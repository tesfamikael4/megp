'use client';
import { useLazyGetAllVendorRequestsQuery } from '@/store/api/vendor_request_handler/new-registration-api';
import {
  Avatar,
  Box,
  Flex,
  Group,
  Pagination,
  Skeleton,
  Text,
  Tooltip,
} from '@mantine/core';
import { Section, logger } from '@megp/core-fe';
import { Where } from '@megp/entity';
import {
  IconClockHour2,
  IconFileInvoice,
  IconTicket,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDateTimeFromString, processCompanyName } from '../../util';
import RequestsSidebar from '../requests-sidebar';

const perPage = 15;

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

type ApplicationListProp = {
  serviceKey: 'new' | 'renewal' | 'upgrade' | 'update' | 'preferential';
  title: string;
};

export default function ApplicationList({
  serviceKey,
  title,
}: ApplicationListProp) {
  const router = useRouter();
  const [getVendorRequest, { data }] = useLazyGetAllVendorRequestsQuery();
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(data?.total || 0, perPage);

  useEffect(() => {
    getVendorRequest({
      serviceKey,
      collectionQuery: {
        take: 15,
        skip: 0,
      },
    });
  }, [serviceKey]);

  useEffect(() => {
    const from = (page - 1) * perPage;

    getVendorRequest?.({
      serviceKey,
      collectionQuery: {
        skip: from,
        take: perPage,
        includes: ['isrVendor'],
      },
    });
  }, [page, serviceKey]);

  const handleFilter = (filter) => {
    const newWhere: Where[][] = [];

    if (filter.trackingNumber) {
      newWhere.push([
        {
          column: 'applicationNumber',
          operator: 'LIKE',
          value: filter.trackingNumber,
        },
      ]);
    }
    if (filter.countryOfRegistration) {
      newWhere.push([
        {
          column: 'isrVendor.basic->>countryOfRegistration',
          operator: 'LIKE',
          value: filter.countryOfRegistration,
        },
      ]);
    }
    if (filter.customerName) {
      newWhere.push([
        {
          column: 'isrVendor.basic->>name',
          operator: 'ILIKE',
          value: `${filter.customerName}`,
        },
      ]);
    }
    if (filter.type) {
      newWhere.push([
        {
          column: 'service.key',
          operator: 'ILIKE',
          value: `${filter.type}`,
        },
      ]);
    }
    if (filter.from) {
      const isoDateString = new Date(filter.from).toISOString();
      const _from = isoDateString.split('T')[0];
      newWhere.push([
        {
          column: 'createdAt',
          operator: '>=',
          value: _from,
        },
      ]);
      if (filter.to) {
        const isoDateString = new Date(filter.to).toISOString();
        const _end = isoDateString.split('T')[0];
        newWhere.push([
          {
            column: 'submittedAt',
            operator: '<=',
            value: _end,
          },
        ]);
      } else {
        const isoDateString = new Date().toISOString();
        const _end = isoDateString.split('T')[0];
        newWhere.push([
          {
            column: 'submittedAt',
            operator: '<=',
            value: _end,
          },
        ]);
      }
    }

    return getVendorRequest({
      serviceKey,
      collectionQuery: {
        take: 15,
        skip: 0,
        where: newWhere,
        includes: ['isrVendor'],
      },
    });
  };

  if (!data) {
    return (
      <>
        <Box className="p-5 w-10/12">
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />

          <Skeleton height={50} mt={10} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />

          <Skeleton height={50} mt={10} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />

          <Skeleton height={50} mt={10} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={10} radius="xl" />
          <Skeleton height={8} mt={10} width="70%" radius="xl" />
        </Box>
      </>
    );
  }

  return (
    <Flex direction="row" gap="sm">
      <Section
        collapsible={false}
        title={`${title !== 'Preferential' ? 'Vendor' : ''} ${title} Applications`}
      >
        {data?.total === 0 && (
          <Box
            h={500}
            className="w-full h-full flex items-center justify-center"
          >
            <Text className="text-gray-500 text-xl">
              No {title} applications found
            </Text>
          </Box>
        )}
        {data?.items.map((item, index) => {
          const { initials, color } = processCompanyName(
            item.isrvendor?.basic.name,
          );
          return (
            <Box
              key={index}
              onClick={() =>
                router.push(
                  `/${
                    serviceKey === 'update'
                      ? 'info-change'
                      : serviceKey === 'preferential'
                        ? 'preferential-services'
                        : serviceKey
                  }/detail/${item.id}`,
                )
              }
            >
              <Flex
                direction="row"
                justify="space-between"
                className={`items-center border border-gray-200 p-3 cursor-pointer hover:bg-primary-50 ${
                  index % 2 === 0 ? 'bg-gray-100' : ''
                }`}
              >
                <Box className="pr-3">
                  <Avatar color={'white'} radius="xl" size="lg" bg={color}>
                    {initials}
                  </Avatar>
                </Box>
                <Box className="gap-[0.125rem] w-2/3">
                  <Box className="text-sm">
                    <Box className="text-primary-800 font-bold">
                      {item.isrvendor?.basic.name}
                    </Box>
                    <Box>
                      <span className="font-semibold">Country:</span>{' '}
                      {item.isrvendor?.basic.countryOfRegistration}
                    </Box>
                    <Box>
                      <span className="font-semibold">Current Task:</span>{' '}
                      {item.task?.name}
                    </Box>
                  </Box>
                </Box>
                <Flex
                  direction="column"
                  className="gap-[0.125rem] border-l border-gray-200 w-1/3 pl-2"
                >
                  <Flex direction="row" className="items-center gap-1 text-sm">
                    <Tooltip label="Tracking number">
                      <IconTicket size={18} />
                    </Tooltip>
                    <Box>{item.applicationNumber}</Box>
                  </Flex>
                  <Flex direction="row" className="items-center gap-1 text-sm">
                    <Tooltip label="Business area">
                      <IconFileInvoice size={18} />
                    </Tooltip>
                    <Box>{item.service.name}</Box>
                  </Flex>

                  <Flex direction="row" className="items-center  gap-1 text-sm">
                    <Tooltip label="Executed time">
                      <IconClockHour2 size={18} />
                    </Tooltip>
                    <Box>{formatDateTimeFromString(item.submittedAt)}</Box>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          );
        })}
        {data.total > 0 ? (
          <Group justify="space-between" mb="lg" mt="lg">
            {data.total !== 0 && (
              <Text>Total : {data.total.toLocaleString()} results</Text>
            )}
            <Pagination
              onChange={setPage}
              size="sm"
              total={totalPages}
              value={page}
              withEdges
            />
          </Group>
        ) : null}
      </Section>
      <Box className="w-2/6">
        <RequestsSidebar
          handleFilter={handleFilter}
          isPreferential={serviceKey === 'preferential'}
        />
      </Box>
    </Flex>
  );
}
