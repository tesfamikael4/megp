'use client';
import { ExpandableTable, Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { Item } from '@/models/tender/lot/item';
import { Select, Textarea, Text } from '@mantine/core';
import { Controller } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useContext, useEffect } from 'react';
import { useLazyTechnicalRequirementsQuery } from '@/app/(features)/tender-workspace/_api/item.api';
import { useSearchParams } from 'next/navigation';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';

export default function TechnicalRequirement({
  item,
  type,
  title,
}: Readonly<{
  item: Item;
  type: string;
  title: string;
}>) {
  const [trigger, { data, isLoading }] = useLazyTechnicalRequirementsQuery();
  const searchParams = useSearchParams();
  const prepareBidContext = useContext(PrepareBidContext);
  const {
    formState: { errors },
    reset,
    register,
    control,
  } = useFormContext();
  useEffect(() => {
    if (data) {
      reset({
        [type]: data.items,
        itemId: item.id,
        procurementCategory: item.procurementCategory,
      });
    }
  }, [data, item.id, reset, type]);
  const config = {
    columns: [
      { accessor: 'category', title: 'Category', width: 300 },
      {
        accessor: 'requirement',
        title: 'Requirement',
        width: 150,
      },
      {
        accessor: 'Compliance',
        header: 'Action',
        render: (record, index) => (
          <>
            <Controller
              name={`${type}.${index}.compliance`}
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <Select
                  placeholder="Compliance"
                  value={value}
                  data={['Comply', 'Not Comply']}
                  onChange={(d) => onChange(d)}
                  error={
                    errors[type] && (errors[type] ?? '')[`${index}`]
                      ? (errors[`${type}`] ?? '')[`${index}`][
                          'compliance'
                        ]?.message?.toString()
                      : ''
                  }
                />
              )}
            />
          </>
        ),
        width: 100,
      },
      {
        accessor: 'Offered Specification',
        header: 'Action',
        render: (record, index) => (
          <>
            <Textarea
              autosize
              minRows={2}
              error={
                errors[type] && (errors[type] ?? '')[`${index}`]
                  ? (errors[`${type}`] ?? '')[`${index}`][
                      'offeredSpecification'
                    ]?.message?.toString()
                  : ''
              }
              {...register(`${type}.${index}.offeredSpecification`)}
            />
          </>
        ),
        width: 300,
      },
    ],
    isExpandable: false,
    isSearchable: false,
    isLoading: isLoading,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: CollectionQuery) => {
    trigger({
      lotId: searchParams.get('lot'),
      itemId: item.id,
      documentType: 'RESPONSE',
      key: type,
      isTree: false,
      password: prepareBidContext?.password,
    });
  };

  return (
    <Section
      title={
        <>
          <Text>{title}</Text>
          <Text className="text-xs text-red-500">
            {errors[type] && '*'} {errors[type]?.message?.toString()}
          </Text>
        </>
      }
      collapsible={true}
      defaultCollapsed={true}
      className="capitalize"
    >
      <ExpandableTable
        config={config}
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
    </Section>
  );
}
