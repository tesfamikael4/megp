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
import { ZodType, z } from 'zod';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Reasons } from './reasons';
import { CustomSelect } from './custom-select';
import { useLazyReadQuery } from '../_api/procurement-requisition.api';
import { useValidateProcurementMethodMutation } from '@/store/api/rule-designer/rule-designer';
import {
  useLazyListByIdQuery,
  useCreateMutation,
  useUpdateMutation,
} from '@/app/(features)/procurement-requisition/_api/mechanization.api';
import { FrameworkSelector } from './framework-selector';
import {
  fundingSources,
  procurementMethodRuleKeys,
  procurementMethods,
  procurementType,
  targetGroups,
} from '../_constants/procurement-method';
import { Section, logger, notify } from '@megp/core-fe';
import { IconDeviceFloppy } from '@tabler/icons-react';

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

  isOnline: z.coerce.boolean({
    required_error: 'Procurement Process is required',
  }),
  targetGroup: z.array(z.string()).default(['Not Applicable']),
});

export const PrMechanization = ({
  disableFields,
}: {
  disableFields: boolean;
}) => {
  const {
    formState: { errors },
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
  } = useForm<any>({
    resolver: zodResolver(activitiesSchema),
  });
  const method = watch('procurementMethod');
  const type = watch('procurementType');
  const fundingSource = watch('fundingSource');

  const [
    getmechanism,
    {
      data: mechanism,
      isLoading: isGetMechanismLoading,
      isSuccess: isGetMechanismSuccess,
    },
  ] = useLazyListByIdQuery();
  const [getPr, { data: pr }] = useLazyReadQuery();

  const [justifications, setJustifications] = useState<Record<string, any>>({});
  const [validateMethod] = useValidateProcurementMethodMutation();
  const [procurementMethodId, setProcurementMethodId] = useState('');

  const [prCreate, { isLoading: isPrCreating }] = useCreateMutation();
  const [prUpdate, { isLoading: isPrUpdating }] = useUpdateMutation();

  const { id } = useParams();
  const [contract, setContract] = useState({});
  const [mode, setMode] = useState<'new' | 'detail'>('new');
  const [donor, setDonor] = useState<string[]>([]);

  const checkIfMethodIsValid = async (val: string) => {
    const valueThreshold = pr?.estimatedAmount ?? 0;
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
              objectId: procurementMethodId,
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

  const onCreate = async (data) => {
    const castedData = {
      ...data,
      procurementRequisitionId: id.toString(),
      contract,
      donor,
    };

    try {
      await prCreate(castedData).unwrap();
      notify('Success', 'Procurement Method Saved Successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onUpdate = async (data) => {
    const castedData = {
      ...mechanism?.items[0],
      ...data,
      procurementRequisitionId: id,
      contract,
      donor,
    };

    try {
      await prUpdate(castedData).unwrap();
      notify('Success', 'Procurement Method updated successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onSubmit = (data) => {
    if (mode === 'new') {
      onCreate(data);
    } else {
      onUpdate(data);
    }
  };

  const onError = (err) => {
    logger.log({ err });
  };

  useEffect(() => {
    (fundingSource == 'Internal Revenue' || fundingSource == 'Treasury') &&
      setDonor([]);
  }, [fundingSource]);
  useEffect(() => {
    getPr(id as string);
  }, [getPr, id]);

  useEffect(() => {
    id !== undefined &&
      getmechanism({
        id: id as string,
        collectionQuery: undefined,
      });
  }, [getmechanism, id]);

  useEffect(() => {
    if (isGetMechanismSuccess && mechanism?.total == 1) {
      const items = mechanism?.items[0];
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
      setProcurementMethodId(items.id);
    }
  }, [isGetMechanismSuccess, mechanism, setValue]);

  return (
    <Section title="Procurement Method" collapsible={false}>
      <div className="flex gap-4">
        <Stack
          pos="relative"
          className={
            Object.keys(justifications).length === 0 ? 'w-full' : 'w-3/5'
          }
        >
          <LoadingOverlay visible={isGetMechanismLoading} />
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
              disableFields={!type}
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
                onChange={onChange}
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
              loading={isPrCreating || isPrUpdating}
              onClick={handleSubmit(onSubmit, onError)}
              disabled={disableFields}
            >
              <IconDeviceFloppy size={14} />
              {mode === 'new' ? 'Save' : 'Update'}
            </Button>
          </Group>
        </Stack>

        {Object.keys(justifications).length !== 0 && (
          <Reasons justification={justifications} />
        )}
      </div>
    </Section>
  );
};
