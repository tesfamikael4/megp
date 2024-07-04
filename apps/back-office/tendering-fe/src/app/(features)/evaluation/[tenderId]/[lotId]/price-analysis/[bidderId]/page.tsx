'use client';

import { BidderOverView } from '@/app/(features)/evaluation/_components/bidder-overview';
import {
  useLazyGetBidderItemsQuery,
  useSaveMarketPriceAnalysisMutation,
} from '@/store/api/tendering/price-analysis.api';
import { Box, Button, Group, Select, TextInput } from '@mantine/core';
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
        width: 150,
        textAlign: 'right',
        accessor: 'offeredUnitPrice',
        render: (record) => (
          <p className="text-right">{record.offeredUnitPrice.toFixed(2)} MKW</p>
        ),
      },
      {
        width: 170,
        textAlign: 'right',
        accessor: 'calculatedBidUnitPrice',
        title: 'Calculated unit price',
        render: (record) => (
          <p className="text-right">
            {record.calculatedBidUnitPrice.toFixed(2)} MKW
          </p>
        ),
      },
      {
        width: 200,
        accessor: 'market_price',
        render: (record) => <MarketPrice record={record} />,
      },
      {
        width: 200,
        accessor: 'remark',
        render: (record) => <Remark record={record} />,
      },
      {
        width: 200,
        accessor: 'evaluation',
        render: (record) => <Evaluation record={record} />,
      },
    ],
  };

  const MarketPrice = ({ record }: any) => {
    const initialValue =
      record.marketPrice == false ? null : record.marketPrice;
    const [value, setValue] = useState<number | null>(initialValue);

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
  const Remark = ({ record }: any) => {
    const initialValue = record.remark == false ? null : record.remark;
    const [value, setValue] = useState<string | null>(initialValue);

    const onBlur = () => {
      const temp = items.map((item) => {
        if (item.itemId === record.itemId)
          return {
            ...item,
            remark: value,
          };
        return item;
      });
      logger.log({ temp });

      setItems(temp);
    };

    useEffect(() => {
      if (record.remark) {
        setValue(record.remark);
      }
    }, [record]);
    return (
      <TextInput
        className="pl-2"
        value={value?.toString() ?? ''}
        onBlur={onBlur}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  };
  const Evaluation = ({ record }: any) => {
    const initialValue = record.accept == false ? 'Reject' : 'Accept';
    const [value, setValue] = useState<string | null>(initialValue);

    const onBlur = () => {
      const temp = items.map((item) => {
        if (item.itemId === record.itemId)
          return {
            ...item,
            accept: value === 'Accept' ? true : false,
          };
        return item;
      });
      logger.log({ temp });

      setItems(temp);
    };

    useEffect(() => {
      if (record.accept === false) {
        setValue('Reject');
      } else {
        setValue('Accept');
      }
    }, [record]);
    return (
      <Select
        value={value?.toString() ?? null}
        data={['Accept', 'Reject']}
        onChange={(e) => setValue(e)}
        onBlur={onBlur}
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
        remark: item.remark,
        accept: item.accept,
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
