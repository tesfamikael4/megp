'use client';
import {
  Badge,
  Box,
  Checkbox,
  Flex,
  Skeleton,
  Text,
  Tooltip,
  Button,
} from '@mantine/core';
import { Fragment, useEffect, useState } from 'react';
import {
  useGetPriceRangeQuery,
  useLazyPostRenewalInvoiceQuery,
} from '../../../_api/query';
import { IconCheckbox, IconRectangle } from '@tabler/icons-react';
import { ApprovedVendorServiceSchema } from '@/shared/schema/venderRenewalSchema';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { useRouter } from 'next/navigation';

const statuses = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
};

const transformCategoryPriceRange = (
  inputData: any,
  businessArea: string,
  id: string,
) =>
  inputData
    .filter(
      (item: any) =>
        item.businessArea.toLowerCase() === businessArea.toLowerCase(),
    )
    .filter((item: any) => item.id === id)
    .map(
      (item: any) => `${item.valueFrom} to ${item.valueTo} ${item.currency}`,
    )[0];

export default function ServicesCard({
  servicesData,
}: {
  servicesData: ApprovedVendorServiceSchema;
}) {
  const getPriceRangeValues = useGetPriceRangeQuery({
    type: 'new',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [request, requestInfo] = useLazyPostRenewalInvoiceQuery();

  const handleSubmit = () => {
    if (selectedServices.length > 0) {
      console.log();
      console.log(servicesData);
      request({
        status: { level: 'Info', status: 'Draft' },
        data: servicesData.data.filter((s) => selectedServices.includes(s.id)),
      });
    }
  };
  const handleProductClick = (productId: string) => {
    if (isServiceSelected(productId)) {
      // If selected, remove it from the array
      setSelectedServices((prevSelected) =>
        prevSelected.filter((id) => id !== productId),
      );
    } else {
      // If not selected, add it to the array
      setSelectedServices((prevSelected) => [...prevSelected, productId]);
    }
  };
  const isServiceSelected = (productId: string): boolean => {
    return selectedServices.includes(productId);
  };
  const router = useRouter();

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on request');
    }

    return () => {};
  }, [requestInfo.error]);

  useEffect(() => {
    if (requestInfo.data && requestInfo.isSuccess) {
      router.push('payment');
    }

    return () => {};
  }, [requestInfo.data, requestInfo.isSuccess]);

  return (
    <Box className="p-4">
      <Flex className="w-full justify-between">
        <Text fz={'xl'} fw={600} color="gray.7">
          Register for
        </Text>

        <Text fz={'md'} fw={600} color="gray.6">
          Selected Services {selectedServices.length}
        </Text>
      </Flex>

      <Box className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2 xl:gap-x-4">
        {getPriceRangeValues.isLoading
          ? Array.from({ length: 3 }, (_, index) => (
              <Box
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                  <Skeleton height={15} width="120" radius="xl" />
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex justify-between gap-x-4 py-3">
                    <Skeleton height={15} width="90" radius="xl" />
                    <Skeleton height={15} width="240" radius="xl" />
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <Skeleton height={15} width="90" radius="xl" />
                    <Flex className="items-start gap-x-2  justify-end">
                      <div className="flex flex-grow  gap-2 max-w-[16rem]">
                        {Array.from({ length: 4 }, (_, index) => (
                          <Skeleton
                            key={index}
                            height={15}
                            width="50"
                            radius="xl"
                          />
                        ))}
                      </div>
                    </Flex>
                  </div>
                </dl>
              </Box>
            ))
          : servicesData.data.map((services) => (
              <Box
                key={services.id}
                className={`overflow-hidden rounded-md border-2 ${
                  isServiceSelected(services.id)
                    ? 'border-[--mantine-color-primary-5] shadow-md'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                  <Text fw={700} fz={'lg'} color="gray.7">
                    {services.areaOfBusinessInterest.category.toUpperCase()}
                  </Text>

                  {isServiceSelected(services.id) ? (
                    <Button
                      variant="light"
                      leftSection={<IconCheckbox size={18} className="p-0" />}
                      onClick={() => handleProductClick(services.id)}
                    >
                      Selected
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleProductClick(services.id)}
                    >
                      Select
                    </Button>
                  )}
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex justify-between gap-x-4 py-3">
                    <Text fw={600} fz={12}>
                      PRICE RANGE
                    </Text>
                    <Text fw={600} fz={'xs'}>
                      {getPriceRangeValues.data &&
                        transformCategoryPriceRange(
                          getPriceRangeValues.data,
                          services.areaOfBusinessInterest.category,
                          services.areaOfBusinessInterest.priceRange,
                        )}
                      {/* {services.areaOfBusinessInterest.priceRange} */}
                    </Text>
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <Text fw={600} fz={12}>
                      LINE OF BUSINESS
                    </Text>
                    <Flex className="items-start gap-x-2  justify-end">
                      <div className="flex flex-grow  gap-2 max-w-[16rem]">
                        {services.areaOfBusinessInterest.lineOfBusiness.map(
                          (line) => (
                            <Tooltip label={line.id} key={line.id}>
                              <Badge variant="light" color="green" fz={8}>
                                {line.id}
                              </Badge>
                            </Tooltip>
                          ),
                        )}
                      </div>
                    </Flex>
                  </div>
                </dl>
              </Box>
            ))}
      </Box>

      <Flex className="w-full justify-end p-8">
        <Button disabled={selectedServices.length <= 0} onClick={handleSubmit}>
          Submit
        </Button>
      </Flex>
    </Box>
  );
}
