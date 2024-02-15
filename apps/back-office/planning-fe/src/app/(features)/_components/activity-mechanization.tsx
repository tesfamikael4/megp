import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  MultiSelect,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { FrameworkSelector } from './framework-selector';
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
import { useLazyReadQuery } from '../_api/activities.api';
import { useLazyReadQuery as useLazyReadPostActivityQuery } from '../_api/post-activity.api';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Reasons } from './reasons';

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
  const [
    validateMethod,
    { data: validationResult, isSuccess: isValidationSuccess },
  ] = useValidateProcurementMethodMutation();

  //activity
  const [getPreActivity, { data: preActivity }] = useLazyReadQuery();
  const [getPostActivity, { data: postActivity }] =
    useLazyReadPostActivityQuery();

  const { id } = useParams();
  const [procurementMethodId, setProcurementMethodId] = useState('');
  const [contract, setContract] = useState({});
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [donor, setDonor] = useState<string[]>([]);
  const [justifications, setJustifications] = useState<Record<string, any>>({});
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
        notify('Success', 'Procurement Method updated successfully');
      }
      if (page == 'post') {
        await postUpdate(castedData).unwrap();
        notify('Success', 'Procurement Method updated successfully');
      }
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onError = (err) => {
    logger.log({ err });
  };

  const onSubmit = (data) => {
    if (mode === 'detail') {
      onUpdate(data);
    } else {
      onCreate(data);
    }
  };

  useEffect(() => {
    //check rule
    const valueThreshold =
      page == 'pre'
        ? preActivity?.estimatedAmount
        : postActivity?.estimatedAmount ?? 0;
    logger.log(method);
    const data = {
      procurementCategory: type?.toLowerCase(),
      valueThreshold: valueThreshold,
    };
    if (method === 'Request for Quotation (RFQ)') {
      validateMethod({
        data,
        key: 'requestForQuotation',
      });
    } else if (method === 'National Competitive Bidding (NCB)') {
      validateMethod({
        data,
        key: 'nationalCompetitiveBidding',
      });
    } else if (method === 'International Competitive Bidding (ICB)') {
      validateMethod({
        data,
        key: 'internationalCompetitiveBidding',
      });
    } else if (method === 'Restricted Tender') {
      validateMethod({
        data,
        key: 'shortListing',
      });
    } else if (method === 'Request for Proposal (RFP)') {
      validateMethod({
        data,
        key: 'expressionOfInterest',
      });
    }
    setContract({});
  }, [method, page, postActivity, preActivity, type, validateMethod]);

  useEffect(() => {
    if (validationResult && isValidationSuccess) {
      if (!validationResult.validation) {
        setJustifications({
          ...justifications,
          procurementMethod: {
            title: 'Procurement Method',
            message:
              'The procurement method used for this activity violates the rule. Please select possible reason why you want this activity by this procurement method',
            possibleReasons: validationResult.possibleReasons,
            objectId: procurementMethodId,
            activityId: id as string,
          },
        });
      } else {
        setJustifications({});
      }
    }
  }, [
    id,
    isValidationSuccess,
    justifications,
    procurementMethodId,
    validationResult,
  ]);
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

      getPreActivity(id as string);
    }
    if (page == 'post') {
      getPostMechanism({
        id: id as string,
        collectionQuery: undefined,
      });
      getPostActivity(id as string);
    }
  }, [
    getPostActivity,
    getPostMechanism,
    getPreActivity,
    getPreMechanism,
    id,
    page,
  ]);

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
      setProcurementMethodId(preMechanism.items[0].id);
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
      setProcurementMethodId(postMechanism.items[0].id);
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
    <div className="flex gap-4">
      <Stack
        pos="relative"
        className={
          Object.keys(justifications).length === 0 ? 'w-full' : 'w-3/5'
        }
      >
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
                // withCheckIcon={false}
                name={name}
                value={value}
                onChange={onChange}
                label="Procurement Method"
                data={[
                  'Request for Quotation (RFQ)',
                  'National Competitive Bidding (NCB)',
                  'International Competitive Bidding (ICB)',
                  'Restricted Tender',
                  'Single Source Procurement',
                  'Request for Proposal (RFP)',
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
                disabled={disableFields || !type}
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
                placeholder="Select Procurement Process"
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
                {
                  value: 'Micro Enterprises',
                  label: 'Micro Enterprises',
                },
                {
                  value: 'Small Enterprises',
                  label: 'Small Enterprises',
                },
                {
                  value: 'Medium Enterprises',
                  label: 'Medium Enterprises',
                },
                { value: 'Marginalized Group', label: 'Marginalized Group' },
                { value: 'Others', label: 'Others' },
              ]}
              className="w-full"
              disabled={disableFields}
              placeholder="Select Supplier Target Group"
            />
          )}
        />

        <Group>
          <Button
            loading={
              isPreCreating || isPostCreating || isPreUpdating || isPostUpdating
            }
            onClick={handleSubmit(onSubmit, onError)}
            disabled={disableFields}
          >
            <IconDeviceFloppy size={14} /> Save
          </Button>
        </Group>
      </Stack>

      {Object.keys(justifications).length !== 0 && (
        <Reasons justification={justifications} />
      )}
    </div>
  );
};
