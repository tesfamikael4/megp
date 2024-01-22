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
import { FrameworkSelector } from './framework-selector';
import { EntityButton } from '@megp/entity';
import { ZodType, z } from 'zod';
import { logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useCreateMutation,
  useLazyListByIdQuery,
  useUpdateMutation,
} from '../_api/pre-mechanism';
import {
  useCreateMutation as useCreatePostMutation,
  useLazyListByIdQuery as useLazyListPostByIdQuery,
  useUpdateMutation as useUpdatePostMutation,
} from '../_api/post-mechanism';
import { useValidateProcurementMethodMutation } from '@/store/api/rule-designer/rule-designer';

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

export const ActivityMechanization = ({
  page,
  disableFields = false,
}: {
  page: 'pre' | 'post';
  disableFields?: boolean;
}) => {
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
  const type = watch('procurementType');
  const fundingSource = watch('fundingSource');

  const [preCreate, { isLoading: isPreCreating }] = useCreateMutation();
  const [postCreate, { isLoading: isPostCreating }] = useCreatePostMutation();
  const [preUpdate, { isLoading: isPreUpdating }] = useUpdateMutation();
  const [postUpdate, { isLoading: isPostUpdating }] = useUpdatePostMutation();
  const [
    getPreMechanism,
    {
      data: preMechanism,
      isLoading: isGetPreMechanismLoading,
      isSuccess: isGetPreMechanismSuccess,
    },
  ] = useLazyListByIdQuery();
  const [
    getPostMechanism,
    {
      data: postMechanism,
      isLoading: isGetPostMechanismLoading,
      isSuccess: isGetPostMechanismSuccess,
    },
  ] = useLazyListPostByIdQuery();
  const [validateMethod] = useValidateProcurementMethodMutation();

  const { id } = useParams();
  const [contract, setContract] = useState({});
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [donor, setDonor] = useState<string[]>([]);
  const onCreate = async (data) => {
    const castedData =
      page == 'pre'
        ? { ...data, preBudgetPlanActivityId: id, contract, donor }
        : { ...data, postBudgetPlanActivityId: id, contract, donor };

    try {
      if (page == 'pre') {
        await preCreate(castedData).unwrap();
        notify('Success', 'Procurement Method Saved Successfully');
      }
      if (page == 'post') {
        await postCreate(castedData).unwrap();
        notify('Success', 'Procurement Method Saved Successfully');
      }
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onUpdate = async (data) => {
    const castedData =
      page == 'pre'
        ? {
            ...preMechanism?.items[0],
            ...data,
            preBudgetPlanActivityId: id,
            contract,
            donor,
          }
        : {
            ...postMechanism?.items[0],
            ...data,
            postBudgetPlanActivityId: id,
            contract,
            donor,
          };

    try {
      if (page == 'pre') {
        await preUpdate(castedData).unwrap();
        notify('Success', 'Procurement mechanization updated successfully');
      }
      if (page == 'post') {
        await postUpdate(castedData).unwrap();
        notify('Success', 'Procurement mechanization updated successfully');
      }
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
    //check rule
    logger.log(method);
    if (method === 'Request for Quotation (RFQ)') {
      logger.log('Yeah');
      validateMethod({
        data: { procurementCategory: type, valueThreshold: 100 },
        key: 'requestForQuotation',
      });
    }
    setContract({});
  }, [method, type, validateMethod]);
  useEffect(() => {
    (fundingSource == 'Internal Revenue' || fundingSource == 'Treasury') &&
      setDonor([]);
  }, [fundingSource]);

  useEffect(() => {
    if (page == 'pre') {
      getPreMechanism({
        id: id as string,
        collectionQuery: undefined,
      });
    }
    if (page == 'post') {
      getPostMechanism({
        id: id as string,
        collectionQuery: undefined,
      });
    }
  }, [getPostMechanism, getPreMechanism, id, page]);

  useEffect(() => {
    if (page == 'pre' && isGetPreMechanismSuccess && preMechanism?.total == 1) {
      setMode('detail');
      setValue('fundingSource', preMechanism.items[0].fundingSource);
      setValue('isOnline', preMechanism.items[0].isOnline);
      setValue('procurementMethod', preMechanism.items[0].procurementMethod);
      setValue('procurementType', preMechanism.items[0].procurementType);
      setValue('targetGroup', preMechanism.items[0].targetGroup);
      setDonor(preMechanism.items[0].donor);
      setContract(preMechanism.items[0].contract);
    }
    if (
      page == 'post' &&
      isGetPostMechanismSuccess &&
      postMechanism?.total == 1
    ) {
      setMode('detail');
      setValue('fundingSource', postMechanism.items[0].fundingSource);
      setValue('isOnline', postMechanism.items[0].isOnline);
      setValue('procurementMethod', postMechanism.items[0].procurementMethod);
      setValue('procurementType', postMechanism.items[0].procurementType);
      setValue('targetGroup', postMechanism.items[0].targetGroup);
      setDonor(postMechanism.items[0].donor);
      setContract(postMechanism.items[0].contract);
    }
  }, [
    isGetPreMechanismSuccess,
    isGetPostMechanismSuccess,
    page,
    preMechanism,
    postMechanism,
    setValue,
  ]);
  return (
    <Stack pos="relative">
      <LoadingOverlay
        visible={isGetPreMechanismLoading || isGetPostMechanismLoading}
      />
      <Flex gap="md">
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
              data={[
                'Goods',
                'Works',
                'Non Consulting Services',
                'Consultancy Services',
                'Motor Vehicle Repair',
              ]}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Type"
              error={
                errors?.procurementType
                  ? errors?.procurementType?.message?.toString()
                  : ''
              }
              disabled={disableFields}
            />
          )}
        />
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
                'Request for Quotation (RFQ)',
                'National Competitive Bidding (NCB)',
                'International Competitive Bidding (ICB) ',
                'Restricted Tender',
                'Single Source Procurement ',
                'Request for Proposal (RFP) ',
                'Two Stage Bidding',
                'Framework Procurement',
                'Purchased Orders (Call off)',
              ]}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Method"
              error={
                errors?.procurementMethod
                  ? errors?.procurementMethod?.message?.toString()
                  : ''
              }
              disabled={disableFields}
            />
          )}
        />
      </Flex>
      {method === 'Purchased Orders (Call off)' && (
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
              data={['Internal Revenue', 'Treasury', 'Loan', 'Donor']}
              className="w-full"
              withAsterisk
              placeholder="Select Funding Source"
              error={
                errors?.fundingSource
                  ? errors?.fundingSource?.message?.toString()
                  : ''
              }
              disabled={disableFields}
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
              disabled={disableFields}
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
          disabled={disableFields}
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
              // { value: 'Not Applicable', label: 'Not Applicable' },
              { value: 'IBM', label: 'Indigenous Black Malawian' },
              { value: 'MSME', label: 'Micro, Small And Medium Enterprises' },
              { value: 'Marginalized Group', label: 'Marginalized Group' },
              { value: 'Others', label: 'Others' },
            ]}
            className="w-full"
            disabled={disableFields}
          />
        )}
      />

      <EntityButton
        mode={mode}
        isSaving={isPreCreating || isPostCreating}
        isUpdating={isPreUpdating || isPostUpdating}
        // isDeleting={isPreDeleting || isPostDeleting}
        onCreate={handleSubmit(onCreate, onError)}
        onReset={onReset}
        onUpdate={handleSubmit(onUpdate)}
        // onDelete={handleSubmit(onDelete)}
        disabled={disableFields}
      />
    </Stack>
  );
};
