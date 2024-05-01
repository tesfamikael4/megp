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
import {
  useGetApprovedVendorInfoQuery,
  useGetVendorInfoQuery,
  useGetVendorQuery,
} from '../../registration/_api/query';
import { services } from '../_constants';

export const ServiceLists = ({ isCompleted }: { isCompleted?: boolean }) => {
  const { data, isLoading } = useGetApprovedVendorInfoQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: ApprovedVendor, isLoading: isApprovedVendorLoading } =
    useGetVendorQuery({});
  const router = useRouter();
  if (isLoading || isApprovedVendorLoading)
    return <LoadingOverlay visible={isLoading} />;
  else {
    const threeMonthsBeforeToday = new Date();
    threeMonthsBeforeToday.setMonth(threeMonthsBeforeToday.getMonth() - 3);

    /** temporary */
    const today = new Date(); // Get today's date
    const threeDaysFromNow = new Date(today); // Create a new date object with today's date
    threeDaysFromNow.setDate(today.getDate() + 3); // Add 3 days to today's date

    const isExpired = data?.services?.some((service) => {
      const _expiredDate = new Date(service.approvedAt as string);
      _expiredDate.setDate(_expiredDate.getDate() + 1);
      return _expiredDate < new Date();
    });
    return (
      <Box className="bg-[#f7f7f7]">
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-3 ">
            <Text fw={700} fz="xl" c={'#1D8E3F'}>
              List of Vendor Services
            </Text>
            <Text c={'dimmed'} size={'14px'} mt={2}>
              List of services. You are eligible for
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
              if (
                ApprovedVendor?.basic.countryOfRegistration !== 'Malawi' &&
                service.title === 'Eligibility for Preferential Treatment'
              )
                return;
              return <ServiceCard key={service.title} {...service} />;
            })}
          </SimpleGrid>
        </Box>
      </Box>
    );
  }
};
