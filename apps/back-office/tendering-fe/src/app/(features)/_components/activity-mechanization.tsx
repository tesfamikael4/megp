import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flex,
  LoadingOverlay,
  MultiSelect,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
// import { FrameworkSelector } from './framework-selector';
import { EntityButton } from '@megp/entity';
import { ZodType, z } from 'zod';
import { logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  useCreateMutation,
  useLazyListByIdQuery,
  useUpdateMutation,
} from '../_api/mechanization.api';
import { FrameworkSelector } from './framework-selector';

const activitiesSchema: ZodType<Partial<any>> = z.object({
  procurementMethod: z.string({
    required_error: 'Procurement Method is required',
  }),
  procurementType: z.string({
    required_error: 'Procurement Type is required',
  }),
  fundingSource: z.string({
    required_error: 'Funding Source  is required',
  }),

  isOnline: z.boolean({
    required_error: 'Procurement Process is required',
  }),
  targetGroup: z.array(z.string()).default(['Not Applicable']),
});

export const ActivityMechanization = () => {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(activitiesSchema),
  });
  const method = watch('procurementMethod');
  const fundingSource = watch('fundingSource');

  const [create, { isLoading: isCreating }] = useCreateMutation();

  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const [
    getmechanism,
    {
      data: mechanism,
      isLoading: isGetMechanismLoading,
      isSuccess: isGetMechanismSuccess,
    },
  ] = useLazyListByIdQuery();

  const { id } = useParams();
  const [contract, setContract] = useState({});
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [donor, setDonor] = useState<string[]>([]);
  const onCreate = async (data) => {
    try {
      await create(data).unwrap();
      notify('Success', 'Procurement mechanization saved successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onUpdate = async (data) => {
    const castedData = {
      ...mechanism?.items[0],
      ...data,
      contract,
      donor,
    };

    try {
      await update(castedData).unwrap();
      notify('Success', 'Procurement mechanization updated successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onError = (err) => {
    logger.log({ err });
  };

  const onReset = () => {
    setContract({});
    setDonor([]);
    reset({
      procurementMethod: undefined,
      procurementType: undefined,
      fundingSource: undefined,
      isOnline: undefined,
      targetGroup: undefined,
    });
  };

  useEffect(() => {
    setContract({});
  }, [method]);
  useEffect(() => {
    (fundingSource == 'Internal Revenue' || fundingSource == 'Treasury') &&
      setDonor([]);
  }, [fundingSource]);

  useEffect(() => {
    getmechanism({
      id: id as string,
      collectionQuery: undefined,
    });
  }, [getmechanism, id]);

  useEffect(() => {
    if (isGetMechanismSuccess && mechanism?.total == 1) {
      setMode('detail');
      setValue('fundingSource', mechanism.items[0].fundingSource);
      setValue('isOnline', mechanism.items[0].isOnline);
      setValue('procurementMethod', mechanism.items[0].procurementMethod);
      setValue('procurementType', mechanism.items[0].procurementType);
      setValue('targetGroup', mechanism.items[0].targetGroup);
      setDonor(mechanism.items[0].donor);
      setContract(mechanism.items[0].contract);
    }
  }, [isGetMechanismSuccess, mechanism]);
  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isGetMechanismLoading} />
      <Flex gap="md">
        <Controller
          name="procurementMethod"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <Select
              withCheckIcon={false}
              name={name}
              value={value}
              onChange={onChange}
              label="Procurement Method"
              data={[
                'Request for Quotation (RFQ) ',
                'National Competitive Bidding (NCB)',
              ]}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Method"
              error={
                errors?.procurementMethod
                  ? errors?.procurementMethod?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="procurementType"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              withCheckIcon={false}
              name={name}
              value={value}
              onChange={onChange}
              label="Procurement Type"
              data={['Goods', 'Works']}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Type"
              error={
                errors?.procurementType
                  ? errors?.procurementType?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      {method === 'Purchased Orders' && (
        <FrameworkSelector
          contract={contract}
          onSelect={(contract) => setContract(contract)}
        />
      )}
      <Flex gap="md" align="center">
        <Controller
          name="fundingSource"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              withCheckIcon={false}
              name={name}
              value={value}
              onChange={onChange}
              label="Funding Source"
              data={['Internal Revenue', 'Treasury']}
              className="w-full"
              withAsterisk
              placeholder="Select Funding Source"
              error={
                errors?.fundingSource
                  ? errors?.fundingSource?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="isOnline"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              name={name}
              value={`${value}`}
              onChange={(d) => onChange(d == 'true')}
              label="Procurement Process"
              data={[
                { label: 'Online', value: 'true' },
                { label: 'Offline', value: 'false' },
              ]}
              className="w-full"
              withCheckIcon={false}
              error={
                errors?.isOnline ? errors?.isOnline?.message?.toString() : ''
              }
              withAsterisk
            />
          )}
        />
      </Flex>
      {(fundingSource == 'Loan' || fundingSource == 'Donor') && (
        <TextInput
          label="Donor"
          withAsterisk
          value={donor[0] ?? ''}
          onChange={(e) => setDonor([e.target.value])}
        />
      )}
      <Controller
        name="targetGroup"
        control={control}
        render={({ field: { name, value, onChange } }) => (
          <MultiSelect
            name={name}
            value={value}
            onChange={onChange}
            label="Supplier Target Group"
            data={[
              { value: 'Not Applicable', label: 'Not Applicable' },
              { value: 'IBM', label: 'Indigenous Black Malawian' },
              { value: 'MSME', label: 'Micro, Small And Medium Enterprises' },
              { value: 'Marginalized Group', label: 'Marginalized Group' },
              { value: 'Others', label: 'Others' },
            ]}
            className="w-full"
          />
        )}
      />

      <EntityButton
        mode={mode}
        isSaving={isCreating}
        isUpdating={isUpdating}
        onCreate={handleSubmit(onCreate, onError)}
        onReset={onReset}
        onUpdate={handleSubmit(onUpdate)}
      />
    </Stack>
  );
};
