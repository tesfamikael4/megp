'use client';

import { BidderOverView } from '@/app/(features)/evaluation/_components/bidder-overview';
import {
  useCreateApplicableRuleForBidderMutation,
  useGetRulesByLotIdQuery,
} from '@/store/api/tendering/bid-price-evaluation.api';
import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Select,
} from '@mantine/core';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BiderDetail() {
  const { tenderId, lotId, itemId, bidderId } = useParams();
  const [createRuleForBidder, { isLoading }] =
    useCreateApplicableRuleForBidderMutation();
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
              value={record.status}
              disabled={isLoading}
              onChange={(e) => onActionChanged(e, record)}
            />
          );
        },
      },
    ],
  };
  const [rules, setRules] = useState<any[]>([]);
  const { data } = useGetRulesByLotIdQuery(lotId);

  const onActionChanged = async (value, record) => {
    try {
      await createRuleForBidder({
        name: record.name,
        type: record.type,
        lotId,
        representation: record.representation,
        itemId,
        bidderId,
      }).unwrap();
      const newRules = rules.map((r) => {
        if (r.id === record.id) {
          return { ...r, status: value };
        }
        return r;
      });
      setRules(newRules);
    } catch (err) {
      if (err.status == 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };

  useEffect(() => {
    if (data) {
      const filteredData = data.items.filter((i) => i.name !== 'unit_price');
      const castedData = filteredData.map((i) => ({ ...i, status: '' }));
      setRules(castedData);
    }
  }, [data]);
  return (
    <Box>
      <BidderOverView
        basePath={`/evaluation/${tenderId}/${lotId}/financial/items/${itemId}`}
        milestone="technicalResponsiveness"
      />

      <Section
        title="Title"
        subTitle="sub title"
        collapsible={false}
        className="mt-2"
      >
        <ExpandableTable config={config} data={rules} />

        <p className="text-center my-5 font-semibold text-2xl">Summary</p>
        <Alert className="mt-2 w-1/2 p-5 mx-auto" color="gray">
          <Flex justify="space-between" className="mt-1">
            <p className="text-end">Offered Unit Price</p>
            <p className="text-end"> 1231</p>
          </Flex>
          {rules
            .filter((r) => r.status === 'Applicable')
            .map((rule) => (
              <Flex justify="space-between" className="mt-1" key={rule.id}>
                <p className="text-end">{rule.name}</p>
                <p className="text-end">
                  {rule.type === 'DEDUCTION' && '-'} {rule.representation}
                </p>
              </Flex>
            ))}
          <Divider className="my-2" />
          <Flex justify="space-between">
            <p className="text-end font-semibold">Calculated Bid Unit Price</p>
            <p className="text-end font-semibold"> 1231</p>
          </Flex>
        </Alert>
        <Group justify="end" className="mt-2">
          <Button>Save</Button>
        </Group>
      </Section>
    </Box>
  );
}
