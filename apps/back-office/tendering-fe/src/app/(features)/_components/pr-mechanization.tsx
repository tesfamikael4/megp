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
import { EntityButton } from '@megp/entity';
import { ZodType, z } from 'zod';
import { notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  useCreateMutation,
  useUpdateMutation,
  useLazyListByIdQuery,
} from '@/app/(features)/_api/mechanization.api';
import { FrameworkSelector } from './framework-selector';
import { useLazyListByIdQuery as useLazyGetAssignedActivitiesQuery } from '../_api/pr-activity.api';
import {
  useLazyGetActivitiesQuery,
  useLazyGetBudgetYearQuery,
} from '@/store/api/budget/budget-year.api';

const activitiesSchema: ZodType<Partial<any>> = z.object({
  procurementMethod: z.string({
    required_error: 'Procurement Method is required',
  }),
  procurementType: z.string({
    required_error: 'Procurement Type is required',
  }),
  fundingSource: z.string({
    required_error: 'Funding Source is required',
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
  const [assignedActivities, setAssignedActivities] = useState<any>();

  const [create, { isLoading: isCreating }] = useCreateMutation();

  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [trigger, { data: assignedActivity }] =
    useLazyGetAssignedActivitiesQuery();

  const [listById, { data: prActivity }] = useLazyGetActivitiesQuery();

  const [triggerBudjet, { data: budget, isSuccess: budgetFeatched }] =
    useLazyGetBudgetYearQuery();

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
      await create({
        ...data,
        procurementRequisitionId: id?.toString(),
        donor,
        contract,
      }).unwrap();
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
      procurementRequisitionId: id?.toString(),
      donor,
    };

    try {
      await update(castedData).unwrap();
      notify('Success', 'Procurement mechanization updated successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
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
    trigger({
      id: id.toString(),
      collectionQuery: undefined,
    });
  }, [id, trigger]);
  useEffect(() => {
    listById({
      id: budget?.items[0]?.id?.toString(),
      collectionQuery: { includes: ['procurementMechanisms'] },
    });
  }, [budget, budgetFeatched, listById]);
  useEffect(() => {
    triggerBudjet(undefined);
  }, [triggerBudjet]);

  useEffect(() => {
    if (isGetMechanismSuccess && mechanism?.total == 1) {
      setMode('detail');
      setValue('fundingSource', mechanism?.items[0]?.fundingSource);
      setValue('isOnline', mechanism.items[0]?.isOnline);
      setValue('procurementMethod', mechanism.items[0]?.procurementMethod);
      setValue('procurementType', mechanism.items[0]?.procurementType);
      setValue('targetGroup', mechanism.items[0]?.targetGroup);
      setDonor(mechanism.items[0]?.donor);
      setContract(mechanism.items[0]?.contract);
    }
  }, [isGetMechanismSuccess, mechanism]);

  useEffect(() => {
    if (assignedActivities && mechanism?.total == 0) {
      setMode('new');
      setValue(
        'fundingSource',
        assignedActivities[0]?.postProcurementMechanisms[0]?.fundingSource,
      );
      setValue(
        'isOnline',
        assignedActivities[0]?.postProcurementMechanisms[0]?.isOnline,
      );
      setValue(
        'procurementMethod',
        assignedActivities[0]?.postProcurementMechanisms[0]?.procurementMethod,
      );
      setValue(
        'procurementType',
        assignedActivities[0]?.postProcurementMechanisms[0]?.procurementType,
      );
      setValue(
        'targetGroup',
        assignedActivities[0]?.postProcurementMechanisms[0]?.targetGroup,
      );
      setDonor(assignedActivities[0]?.postProcurementMechanisms[0]?.donor);
      setContract(
        assignedActivities[0]?.postProcurementMechanisms[0]?.contract,
      );
    }
  }, [assignedActivities, mechanism?.total]);

  useEffect(() => {
    const filter = prActivity?.items?.filter(
      (activity) =>
        assignedActivity &&
        assignedActivity.items.some(
          (assigned) =>
            assigned.annualProcurementPlanActivityId === activity.id,
        ),
    );
    setAssignedActivities(filter);
  }, [assignedActivity, prActivity]);

  return (
    <Stack pos="relative" pb={'sm'}>
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
              disabled={mode === 'detail' && true}
              data={
                assignedActivity?.total !== 0 && assignedActivities
                  ? [
                      `${assignedActivities[0]?.procurementMechanisms?.procurementType}`,
                    ]
                  : [
                      'Goods',
                      'Works',
                      'Non Consulting Services',
                      'Consultancy Services',
                      'Motor Vehicle Repair',
                    ]
              }
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
              data={['Internal Revenue', 'Treasury', 'Loan', 'Donor']}
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
        onCreate={handleSubmit(onCreate)}
        onReset={onReset}
        onUpdate={handleSubmit(onUpdate)}
      />
    </Stack>
  );
};
