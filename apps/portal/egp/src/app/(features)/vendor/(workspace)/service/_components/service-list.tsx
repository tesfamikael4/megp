import {
  Box,
  Divider,
  Flex,
  LoadingOverlay,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { ServiceCard } from './service-card';
import { useRouter } from 'next/navigation';
import { useGetApprovedVendorInfoQuery } from '../../registration/_api/query';
import { services } from '../_constants';

export const ServiceLists = ({ isCompleted }: { isCompleted?: boolean }) => {
  const { data, isLoading } = useGetApprovedVendorInfoQuery({});
  const router = useRouter();
  if (isLoading) return <LoadingOverlay visible={isLoading} />;
  else {
    const threeMonthsBeforeToday = new Date();
    threeMonthsBeforeToday.setMonth(threeMonthsBeforeToday.getMonth() - 3);
    const isExpired = data?.services?.some(
      (service) =>
        new Date(service.expireDate as string) < threeMonthsBeforeToday,
    );
    return (
      <Box className="p-4 bg-[#f7f7f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-3 ">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              List of Vendor Services
            </Text>
            <Text c={'dimmed'} size={'14px'} mt={2}>
              Welcome to My Payments! Here you can manage your payment
              information and view your transaction history.
            </Text>
          </Flex>
          <Divider />
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
              xl: 3,
            }}
            my={'md'}
          >
            {services.map((service) => {
              if (isCompleted && service.title === 'Add Additional Services')
                return;
              if (!isExpired && service.title === 'Renew registration') return;
              return <ServiceCard key={service.title} {...service} />;
            })}
          </SimpleGrid>
        </Box>
      </Box>
    );
  }
};
