'use client';

import { BidderOverView } from '@/app/(features)/evaluation/_components/bidder-overview';
import {
  useLazyGetBidderItemsQuery,
  useSaveMarketPriceAnalysisMutation,
} from '@/store/api/tendering/price-analysis.api';
import { Box, Button, Group, TextInput } from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  logger,
  notify,
} from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BiderDetail() {
  const { tenderId, lotId, bidderId } = useParams();
  const [getBidderItems, { data: bidderItems, isLoading }] =
    useLazyGetBidderItemsQuery();
  const [save, { isLoading: isSaving }] = useSaveMarketPriceAnalysisMutation();
  const [items, setItems] = useState<any[]>([]);
  const config: ExpandableTableConfig = {
    minHeight: 150,
    isLoading: isLoading,
    columns: [
      {
        accessor: 'name',
      },
      {
        accessor: 'offeredUnitPrice',
      },
      {
        width: 300,
        accessor: 'market_price',
        render: (record) => <MarketPrice record={record} />,
      },
    ],
  };

  const MarketPrice = ({ record }: any) => {
    const initialValue =
      record.marketPrice == false ? null : record.marketPrice;
    const [value, setValue] = useState<number | null>(initialValue);
    logger.log({ initialValue });

    const onBlur = () => {
      const temp = items.map((item) => {
        if (item.itemId === record.itemId)
          return {
            ...item,
            marketPrice: value,
          };
        return item;
      });
      logger.log({ temp });

      setItems(temp);
    };

    useEffect(() => {
      if (record.marketPrice) {
        setValue(record.marketPrice);
      }
    }, [record]);
    return (
      <TextInput
        className="pl-2"
        leftSection="MKW"
        value={value?.toString() ?? ''}
        onBlur={onBlur}
        type="number"
        onChange={(e) => setValue(parseFloat(e.target.value))}
      />
    );
  };

  const getItems = async () => {
    try {
      const res = await getBidderItems({ tenderId, lotId, bidderId }).unwrap();
      setItems(res);
    } catch (err) {
      logger.log({ err });
    }
  };

  const onSave = async () => {
    const castedData = items.map((item) => {
      return {
        lotId,
        bidderId,
        itemId: item.itemId,
        marketUnitPrice: item.marketPrice,
      };
    });
    try {
      await save({ priceAnalysis: castedData }).unwrap();
      notify('Success', 'Saved successfully');
    } catch (err) {
      if (err.status === 430) notify('Error', err.data.message);
      else notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getItems();
  }, [bidderItems]);

  return (
    <Box>
      <BidderOverView
        basePath={`/evaluation/${tenderId}/${lotId}/price-analysis`}
        milestone="priceAnalysis"
      />

      <Section className="mt-2" title="Items" collapsible={false}>
        <ExpandableTable config={config} data={items ?? []} />
        <Group className="mt-2" justify="end">
          <Button onClick={onSave} loading={isSaving}>
            Save
          </Button>
        </Group>
      </Section>
    </Box>
  );
}
