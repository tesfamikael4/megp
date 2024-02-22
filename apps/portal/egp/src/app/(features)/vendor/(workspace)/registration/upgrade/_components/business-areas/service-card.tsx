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
  Select,
  SimpleGrid,
} from '@mantine/core';
import { Fragment, useEffect, useState } from 'react';
import { useGetPriceRangeQuery } from '../../../_api/query';
import { IconCheckbox, IconRectangle } from '@tabler/icons-react';
import { ApprovedVendorServiceSchema } from '@/shared/schema/venderRenewalSchema';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { useRouter } from 'next/navigation';
import {
  useGetMyInvoiceQuery,
  useRequestUpgradeInvoiceMutation,
} from '@/store/api/vendor-upgrade/api';
import { z } from 'zod';

const statuses = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
};

const businessStreamSchema = z.array(
  z.object({
    id: z.string().uuid(),
    priceId: z.string().uuid(),
  }),
);

const transformCategoryPriceRange = (
  inputData: any,
  businessArea: string,
  id: string,
) =>
  inputData
    .filter(
      (item: any) =>
        item.businessArea.toLowerCase() === businessArea?.toLowerCase(),
    )
    .filter((item: any) => item.id === id)
    .map(
      (item: any) => `${item.valueFrom} to ${item.valueTo} ${item.currency}`,
    )[0];

export default function ServicesCard({ servicesData }: { servicesData: any }) {
  const getPriceRangeValues = useGetPriceRangeQuery({
    type: 'new',
  });
  const router = useRouter();

  const [selectedServices, setSelectedServices] = useState<
    { id: string; pricingId: string; category: string }[]
  >([]);

  const [request, requestInfo] = useRequestUpgradeInvoiceMutation();

  const handleSubmit = async () => {
    if (selectedServices.length > 0) {
      try {
        await request({
          BusinessAreaStatus: servicesData.status,
          upgrades: selectedServices.filter((service) => service?.pricingId),
        }).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  function updatePriceIfServiceIsAlreadyInAnInvoice(
    category: string,
    productId: string,
  ) {
    const item = servicesData?.status?.selectedPriceRange.find(
      (item) => item._businessAreaId === productId,
    );
    // If not selected, add it to the array
    setSelectedServices((prevSelected) => [
      ...prevSelected,
      { id: productId, pricingId: item?.pricingId ?? '', category: category },
    ]);
  }

  const handleProductClick = (productId: string, category: string) => {
    if (isServiceSelected(productId)) {
      // If selected, remove it from the array
      setSelectedServices((prevSelected) =>
        prevSelected.filter((item) => item.id !== productId),
      );
    } else {
      updatePriceIfServiceIsAlreadyInAnInvoice(category, productId);
    }
  };

  const handlePriceRangeChange = (productId: string, pricingId: string) => {
    if (isServiceSelected(productId)) {
      //find the product and update the pricingId
      const updatedServices = selectedServices.map((service) => {
        if (service.id === productId) {
          return { ...service, pricingId: pricingId };
        }
        return service;
      });

      setSelectedServices(updatedServices);
    }
  };

  const isServiceSelected = (productId: string): boolean => {
    return selectedServices.some((item: any) => item.id == productId);
  };

  const isServiceDrafted = (
    businessAreaId: string,
  ): { hasInvoice: boolean; newPricingId: string } => {
    const hasInvoice = servicesData?.status?.selectedPriceRange.find(
      (item: any) => {
        return item._businessAreaId == businessAreaId;
      },
    );
    return {
      hasInvoice: hasInvoice ? true : false,
      newPricingId: hasInvoice?.pricingId,
    };
  };

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on request');
    }

    return () => {};
  }, [requestInfo.error]);

  useEffect(() => {
    if (requestInfo.isSuccess) {
      // NotificationService.requestSuccessNotification('Invoice created successfully');
      router.push('payment');
    }
  }, [requestInfo.isSuccess]);

  useEffect(() => {
    if (
      servicesData?.status?.selectedPriceRange &&
      servicesData?.status?.selectedPriceRange.length > 0
    ) {
      setSelectedServices([]);
      servicesData?.status?.selectedPriceRange.forEach((item) => {
        const matchedService = servicesData.data.find((service) => {
          return service._businessAreaId === item.id;
        });

        if (
          matchedService &&
          !selectedServices.some(
            (service) => service.id === item._businessAreaId,
          )
        ) {
          setSelectedServices((prevSelected) => [
            ...prevSelected,
            {
              id: matchedService.id,
              pricingId: item.pricingId,
              category: matchedService.areaOfBusinessInterest?.category,
            },
          ]);
        }
      });
    }
  }, [servicesData.data, servicesData?.status?.selectedPriceRange]);

  const priceRangeByCategory = (category: 'Goods' | 'Services' | 'Works') => {
    return getPriceRangeValues.data
      ? getPriceRangeValues.data
          .filter(
            (item: any) =>
              item.businessArea.toLowerCase() === category.toLowerCase(),
          )
          .map((item: any) => ({
            value: item.id,
            label: `${item.valueFrom} to ${item.valueTo} ${item.currency}`,
          }))
      : [];
  };

  return (
    <Box className="p-4">
      <Flex className="w-full justify-between">
        <Text fz={'xl'} fw={600} color="gray.7">
          List of Business Streams
        </Text>

        <Text fz={'md'} fw={600} color="gray.6">
          Selected Business Streams {selectedServices.length}
        </Text>
      </Flex>

      <SimpleGrid
        cols={{
          base: 1,
          xl: 2,
        }}
      >
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
          : servicesData.data.map((services) => {
              const { hasInvoice, newPricingId } = isServiceDrafted(
                services.id,
              );
              return (
                <Box
                  key={services.id}
                  className={`overflow-hidden rounded-md border-2 ${
                    isServiceSelected(services.id) || hasInvoice
                      ? 'border-[--mantine-color-primary-5] shadow-md'
                      : 'border-gray-200'
                  } `}
                >
                  <div className="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                    <Text fw={700} fz={'lg'} color="gray.7">
                      {services?.areaOfBusinessInterest?.category.toUpperCase()}
                    </Text>

                    {isServiceSelected(services.id) ? (
                      <Button
                        variant="light"
                        leftSection={<IconCheckbox size={18} className="p-0" />}
                        onClick={() =>
                          handleProductClick(
                            services?.id,
                            services?.areaOfBusinessInterest?.category,
                          )
                        }
                      >
                        Selected
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleProductClick(
                            services?.id,
                            services?.areaOfBusinessInterest?.category,
                          )
                        }
                      >
                        Select
                      </Button>
                    )}
                  </div>
                  <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                    <div className="flex justify-between gap-x-4 py-3">
                      <Text fw={600} fz={12}>
                        Price Range
                      </Text>
                      <Text fw={600} fz={'xs'}>
                        {getPriceRangeValues.data &&
                          transformCategoryPriceRange(
                            getPriceRangeValues?.data,
                            services?.areaOfBusinessInterest?.category,
                            services?.areaOfBusinessInterest?.priceRange,
                          )}
                        {/* {services.areaOfBusinessInterest.priceRange} */}
                      </Text>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <Text fw={600} fz={12}>
                        Line Of Business
                      </Text>
                      <Flex className="items-start gap-x-2  justify-end">
                        <div className="flex flex-grow  gap-2 max-w-[16rem]">
                          {services?.areaOfBusinessInterest?.lineOfBusiness.map(
                            (line) => (
                              <Tooltip label={line.name} key={line.id}>
                                <Badge variant="light" color="green" fz={8}>
                                  {line.name}
                                </Badge>
                              </Tooltip>
                            ),
                          )}
                        </div>
                      </Flex>
                    </div>
                    {isServiceSelected(services.id) && (
                      <div className="flex justify-between gap-x-4 py-3">
                        <Text fw={600} fz={12}>
                          Select New Price Range
                        </Text>
                        <Flex className="items-start gap-x-2  justify-end w-1/2">
                          <Select
                            data={priceRangeByCategory(
                              services?.areaOfBusinessInterest?.category as any,
                            )}
                            defaultValue={
                              newPricingId ??
                              services?.areaOfBusinessInterest?.priceRange
                            }
                            className="w-full"
                            checkIconPosition="right"
                            placeholder="Select new price range"
                            onChange={(value) => {
                              return handlePriceRangeChange(
                                services.id,
                                value as string,
                              );
                            }}
                            allowDeselect={false}
                          />
                        </Flex>
                      </div>
                    )}
                  </dl>
                </Box>
              );
            })}
      </SimpleGrid>

      <Flex className="w-full justify-end p-8">
        <Button
          disabled={selectedServices.length <= 0}
          onClick={handleSubmit}
          loading={requestInfo?.isLoading}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
}
