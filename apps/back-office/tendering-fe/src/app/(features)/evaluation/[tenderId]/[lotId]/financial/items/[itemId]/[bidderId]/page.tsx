'use client';

import { BidderOverView } from '@/app/(features)/evaluation/_components/bidder-overview';
import {
  useCreateApplicableRuleForBidderMutation,
  useCreateUnitPriceMutation,
  useDeleteApplicableRuleForBidderMutation,
  useGetBidderSummaryQuery,
  useGetHasUnitPriceQuery,
  useGetRulesByBidderIdQuery,
  useSaveBidPriceMutation,
} from '@/store/api/tendering/bid-price-evaluation.api';
import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function BiderDetail() {
  const { tenderId, lotId, itemId, bidderId } = useParams();
  const [createRuleForBidder, { isLoading }] =
    useCreateApplicableRuleForBidderMutation();
  const [deleteRuleForBidder, { isLoading: isDeleting }] =
    useDeleteApplicableRuleForBidderMutation();
  const { data: hasUnitPrice, isLoading: isUnitPriceLoading } =
    useGetHasUnitPriceQuery({ lotId, itemId, bidderId });
  const [createUnitPrice, { isLoading: isCreatingUnitprice }] =
    useCreateUnitPriceMutation();
  const [save, { isLoading: isSaving }] = useSaveBidPriceMutation();
  const config: ExpandableTableConfig = {
    minHeight: 100,
    columns: [
      { accessor: 'name' },
      { accessor: 'type' },
      { accessor: 'representation' },
      {
        accessor: 'action',
        width: 200,
        render: (record) => {
          return (
            <Select
              data={['Applicable', 'Not Applicable']}
              className="w-/12"
              value={record.applicable ? 'Applicable' : 'Not Applicable'}
              disabled={isLoading || isDeleting}
              onChange={(e) => onActionChanged(e, record)}
            />
          );
        },
      },
    ],
  };
  const { data } = useGetRulesByBidderIdQuery({ lotId, itemId, bidderId });
  const { data: bidderSummary } = useGetBidderSummaryQuery({
    lotId,
    itemId,
    bidderId,
  });

  const onActionChanged = async (value, record) => {
    try {
      if (value === 'Applicable') {
        await createRuleForBidder({
          name: record.name,
          type: record.type,
          lotId,
          representation: record.representation,
          itemId,
          bidderId,
        }).unwrap();
      } else {
        await deleteRuleForBidder(record.formulaImplementationId).unwrap();
      }

      notify('Success', 'saved successfully');
    } catch (err) {
      if (err.status == 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  const initUnitPrice = async () => {
    try {
      createUnitPrice({ lotId, itemId, bidderId }).unwrap();
    } catch (err) {
      if (err.status == 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong please reload the page');
      }
    }
  };

  const onSave = async () => {
    try {
      await save({
        lotId,
        bidderId,
        itemId,
      }).unwrap();
      notify('Success', 'Saved successfully');
    } catch (err) {
      if (err.status == 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  useEffect(() => {
    if (hasUnitPrice && !hasUnitPrice?.hasFormula) {
      initUnitPrice();
    }
  }, [hasUnitPrice]);
  return (
    <Box>
      <BidderOverView
        basePath={`/evaluation/${tenderId}/${lotId}/financial/items/${itemId}`}
        milestone="financial"
      />

      <Section
        title="Title"
        subTitle="sub title"
        collapsible={false}
        className="mt-2"
      >
        <Box pos="relative" className="min-h-36">
          <LoadingOverlay visible={isUnitPriceLoading || isCreatingUnitprice} />
          {hasUnitPrice?.hasFormula && (
            <Box>
              <ExpandableTable
                config={config}
                data={data?.filter((i) => i.name !== 'unit_price') ?? []}
              />

              <p className="text-center my-5 font-semibold text-2xl">Summary</p>
              <Alert className="mt-2 w-1/2 p-5 mx-auto mb-10" color="gray">
                {bidderSummary?.map((rule) => (
                  <Flex justify="space-between" className="mt-1" key={rule.id}>
                    <p className="text-end">
                      {rule.name === 'unit_price'
                        ? 'Offered Unit Price'
                        : rule.name}
                    </p>
                    <p className="text-end">
                      {rule.type === 'DEDUCTION' && '-'} {rule.result}
                    </p>
                  </Flex>
                ))}
                <Divider className="my-2" />
                <Flex justify="space-between">
                  <p className="text-end font-semibold">
                    Calculated Bid Unit Price
                  </p>
                  <p className="text-end font-semibold">
                    {' '}
                    {bidderSummary
                      ?.reduce((sum, item) => {
                        if (item.type === 'ADDITION' || item.type === 'TAXES') {
                          return sum + item.result;
                        } else if (item.type === 'DEDUCTION') {
                          return sum - item.result;
                        } else {
                          return sum;
                        }
                      }, 0)
                      ?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'MKW',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        currencyDisplay: 'code',
                      }) ?? 0}
                  </p>
                </Flex>
              </Alert>
              <Group justify="end" className="mt-2 w-1/2 mx-auto">
                <Button loading={isSaving} onClick={onSave}>
                  Save
                </Button>
              </Group>
            </Box>
          )}
        </Box>
      </Section>
    </Box>
  );
}
