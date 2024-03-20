import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  MultiSelect,
  Stack,
  TextInput,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { FrameworkSelector } from './framework-selector';
import { ZodType, z } from 'zod';
import { Section, logger, notify } from '@megp/core-fe';
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
import {
  useValidateProcurementMethodMutation,
  useValidateTargetGroupMutation,
} from '@/store/api/rule-designer/rule-designer';
import { useLazyReadQuery } from '../_api/activities.api';
import { useLazyReadQuery as useLazyReadPostActivityQuery } from '../_api/post-activity.api';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Reasons } from './reasons';
import {
  fundingSources,
  procurementMethodRuleKeys,
  procurementMethods,
  procurementType,
  targetGroupRuleKeys,
  targetGroups,
} from '../_constants/procurement-method';
import { CustomSelect } from './custom-select';

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

  isOnline: z.coerce.boolean({
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
    reset,
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
  const [validateTargetGroup] = useValidateTargetGroupMutation();

  //activity
  const [getPreActivity, { data: preActivity }] = useLazyReadQuery();
  const [getPostActivity, { data: postActivity }] =
    useLazyReadPostActivityQuery();

  const { id } = useParams();
  // const [procurementMethodId, setProcurementMethodId] = useState('');
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
      } else {
        await postCreate(castedData).unwrap();
        notify('Success', 'Procurement Method Saved Successfully');
      }
    } catch (err) {
      if (err.status === 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
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
      } else {
        await postUpdate(castedData).unwrap();
        notify('Success', 'Procurement Method updated successfully');
      }
    } catch (err) {
      if (err.status === 430) {
        notify('Error', err.data.message);
      } else {
        notify('Error', 'Something went wrong');
      }
    }
  };
  const onError = (err) => {
    logger.log({ err });
  };

  const onSubmit = (data) => {
    const castedData = {
      ...data,
      justification: [
        {
          key: 'procurementMethod',
          status: justifications.procurementMethod ? 'fail' : 'pass',
        },
        {
          key: 'targetGroup',
          status: justifications.targetGroup ? 'fail' : 'pass',
        },
      ],
    };
    if (mode === 'detail') {
      onUpdate(castedData);
    } else {
      onCreate(castedData);
    }
  };

  const checkIfMethodIsValid = async (val: string) => {
    const valueThreshold =
      page == 'pre'
        ? preActivity?.estimatedAmount
        : postActivity?.estimatedAmount ?? 0;
    const key: string | undefined = Object.keys(procurementMethodRuleKeys).find(
      (key) => procurementMethodRuleKeys[key] === val,
    );
    const data = {
      procurementCategory: type?.toLowerCase(),
      valueThreshold: valueThreshold,
    };

    if (key) {
      try {
        const res = await validateMethod({
          data,
          key: key,
        }).unwrap();

        if (!res.validation) {
          setJustifications({
            ...justifications,
            procurementMethod: {
              title: 'Procurement Method',
              message:
                'The procurement method used for this activity violates the rule. Please select possible reason why you want this activity by this procurement method',
              possibleReasons: res.possibleReasons,
              // objectId: procurementMethodId,
              activityId: id as string,
            },
          });
        } else {
          const { procurementMethod, ...temp } = justifications;
          setJustifications({ ...temp });
        }
      } catch (err) {
        logger.log({ err });
      }
    } else {
      const { procurementMethod, ...temp } = justifications;
      setJustifications({ ...temp });
    }
  };

  const checkIfTargetGroupIsValid = async (val: string[]) => {
    const valueThreshold =
      page == 'pre'
        ? preActivity?.estimatedAmount
        : postActivity?.estimatedAmount ?? 0;
    const key: string[] = Object.keys(targetGroupRuleKeys).filter((key) =>
      val.includes(targetGroupRuleKeys[key]),
    );
    const data = {
      procurementCategory: type?.toLowerCase(),
      valueThreshold: valueThreshold,
    };

    if (key.length !== 0) {
      try {
        const res = await validateTargetGroup({
          params: data,
          designerKeys: key,
        }).unwrap();

        if (!res.validation) {
          setJustifications({
            ...justifications,
            targetGroup: {
              title: 'Target Group',
              message:
                'The target group used for this activity violates the rule. Please select possible reason why you want this activity by this target group',
              possibleReasons: res.possibleReasons,
              // objectId: procurementMethodId,
              activityId: id as string,
            },
          });
        } else {
          const { targetGroup, ...temp } = justifications;
          setJustifications({ ...temp });
        }
      } catch (err) {
        logger.log({ err });
      }
    } else {
      const { targetGroup, ...temp } = justifications;
      setJustifications({ ...temp });
    }
  };

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
    } else {
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
      const items = preMechanism.items[0];
      reset({
        fundingSource: items.fundingSource,
        isOnline: items.isOnline,
        procurementMethod: items.procurementMethod,
        procurementType: items.procurementType,
        targetGroup: items.targetGroup,
      });
      setMode('detail');
      setDonor(items.donor);
      setContract(items.contract);
      // setProcurementMethodId(items.id);
    }
    if (
      page == 'post' &&
      isGetPostMechanismSuccess &&
      postMechanism?.total == 1
    ) {
      const items = postMechanism.items[0];
      setMode('detail');
      reset({
        fundingSource: items.fundingSource,
        isOnline: items.isOnline,
        procurementMethod: items.procurementMethod,
        procurementType: items.procurementType,
        targetGroup: items.targetGroup,
      });
      setDonor(items.donor);
      setContract(items.contract);
      // setProcurementMethodId(items.id);
    }
  }, [
    isGetPreMechanismSuccess,
    isGetPostMechanismSuccess,
    page,
    preMechanism,
    postMechanism,
    reset,
  ]);
  return (
    <Section title="Procurement Method" collapsible={false}>
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
            <CustomSelect
              label="Procurement Type"
              placeholder="Select Procurement Type"
              name="procurementType"
              control={control}
              data={procurementType}
              errors={errors}
              disableFields={disableFields}
            />
            <CustomSelect
              label="Procurement Method"
              name="procurementMethod"
              placeholder="Select Procurement Method"
              control={control}
              data={procurementMethods}
              errors={errors}
              actions={checkIfMethodIsValid}
              disableFields={disableFields || !type}
            />
          </Flex>
          {method === 'Purchased Orders (Call off)' && (
            <FrameworkSelector
              contract={contract}
              onSelect={(contract) => setContract(contract)}
            />
          )}
          <Flex gap="md" align="center">
            <CustomSelect
              label="Funding Source"
              name="fundingSource"
              control={control}
              data={fundingSources}
              placeholder="Select Funding Source"
              errors={errors}
              disableFields={disableFields}
            />
            <CustomSelect
              label="Procurement Process"
              name="isOnline"
              placeholder="Select Procurement Process"
              control={control}
              data={[
                { label: 'Online', value: 'true' },
                { label: 'Offline', value: 'false' },
              ]}
              errors={errors}
              disableFields={disableFields}
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
                onChange={(val) => {
                  onChange(val);
                  checkIfTargetGroupIsValid(val);
                }}
                label="Supplier Target Group"
                data={targetGroups}
                className="w-full"
                disabled={disableFields}
                placeholder="Select Supplier Target Group"
              />
            )}
          />

          <Group>
            <Button
              loading={
                isPreCreating ||
                isPostCreating ||
                isPreUpdating ||
                isPostUpdating
              }
              onClick={handleSubmit(onSubmit, onError)}
              disabled={disableFields}
            >
              <IconDeviceFloppy size={14} /> Save
            </Button>
          </Group>
        </Stack>

        {Object.keys(justifications).length !== 0 && (
          <Reasons justification={justifications} page={page} />
        )}
      </div>
    </Section>
  );
};
