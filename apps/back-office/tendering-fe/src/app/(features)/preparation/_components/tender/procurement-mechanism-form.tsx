import { ProcurementMechanism } from '@/models/tender/evaluation-mechanism';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flex,
  LoadingOverlay,
  NativeSelect,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
} from '../../_api/tender/procurement-mechanisms.api';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { useLazyGetAnalyticsQuery } from '../../_api/tender/procurement-requisition.api';

interface ProcurementMechanismFormProps {
  prId: string;
}
export default function ProcurementMechanismForm({
  prId,
}: ProcurementMechanismFormProps) {
  const { id } = useParams();
  const ProcurementMechanismSchema: ZodType<Partial<ProcurementMechanism>> =
    z.object({
      invitationType: z.enum(['direct', 'limited', 'open']),
      stageType: z.enum(['single', 'multiple']),
      marketApproach: z.enum(['local', 'national', 'international']),
    });
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());
  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(ProcurementMechanismSchema),
  });
  const stageTypeValue = watch('stageType');
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const [triggerAnalytics, { data: analytics, isLoading: analyticsLoading }] =
    useLazyGetAnalyticsQuery();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
        stage: stageTypeValue === 'single' ? 1 : 2,
      });
      notify('Success', 'Procurement Mechanism created successfully');
    } catch (err) {
      notify('Error', 'Error in creating procurement mechanism');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: id?.toString(),
        stage: stageTypeValue === 'single' ? 1 : data.stage,
      });
      notify('Success', 'Qualification updated successfully');
    } catch {
      notify('Error', 'Error in updating spd');
    }
  };
  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        invitationType: selected?.invitationType,
        stageType: selected?.stageType,
        marketApproach: selected?.marketApproach,
        stage: selected?.stage,
      });
    } else {
      reset({
        invitationType: '',
        stageType: '',
        marketApproach: '',
        stage: 1,
      });
    }
  }, [reset, selected, selectedSuccess]);

  useEffect(() => {
    if (prId) {
      triggerAnalytics(prId);
    }
  }, [prId, triggerAnalytics]);

  return (
    <Stack pos="relative">
      <LoadingOverlay
        visible={isLoading || isUpdating || isSaving || analyticsLoading}
      />
      <div className="w-full flex space-x-4">
        <NativeSelect
          placeholder="Invitation Type"
          withAsterisk
          label="Invitation Type"
          className="w-1/2"
          data={['direct', 'limited', 'open']}
          error={
            errors?.invitationType
              ? errors?.invitationType?.message?.toString()
              : ''
          }
          {...register('invitationType')}
        />
        <Controller
          name="stageType"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NativeSelect
              label="Stage Type"
              placeholder="Stage Type"
              withAsterisk
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(d)}
              data={[
                { value: 'single', label: 'Single Stage' },
                { value: 'multiple', label: 'Multiple Value' },
              ]}
              error={
                errors?.stageType ? errors?.stageType?.message?.toString() : ''
              }
            />
          )}
        />
      </div>
      <div className="w-full flex space-x-4">
        <NativeSelect
          placeholder="Market Approach"
          withAsterisk
          className="w-1/2"
          label="Market Approach"
          data={['local', 'national', 'international']}
          error={
            errors?.marketApproach
              ? errors?.marketApproach?.message?.toString()
              : ''
          }
          {...register('marketApproach')}
        />
      </div>

      <EntityButton
        mode={selected !== undefined ? 'detail' : 'new'}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
      {analytics && analytics.items[0] && (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Procurement Type
              </Table.Td>
              <Table.Td>{analytics.items[0].procurementType}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Procurement Method
              </Table.Td>
              <Table.Td>{analytics.items[0].procurementMethod}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Funding Source
              </Table.Td>
              <Table.Td>{analytics.items[0].fundingSource}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Target Group
              </Table.Td>
              <Table.Td>
                {analytics.items[0].targetGroup &&
                  analytics.items[0].targetGroup.length > 0 && (
                    <Flex gap={'sm'}>
                      {analytics.items[0].targetGroup.map((element, index) => (
                        <Text key={index}>
                          {' '}
                          {element}{' '}
                          {index < analytics.items[0].targetGroup.length - 1
                            ? ','
                            : ''}{' '}
                        </Text>
                      ))}
                    </Flex>
                  )}
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Donor
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Contract
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="bg-slate-100 font-semibold w-2/6">
                Is Online
              </Table.Td>
              <Table.Td>{analytics.items[0].isOnline ? 'Yes' : 'No'}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}
