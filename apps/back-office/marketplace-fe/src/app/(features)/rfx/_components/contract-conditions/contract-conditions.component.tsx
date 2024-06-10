'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Flex,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Stack,
  Switch,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useCreateMutation,
  useLazyListByIdQuery,
  useUpdateMutation,
} from '../../_api/rfx/contract-conditions.api';
import { useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';

const schema = z.object({
  liquidityDamage: z.number(),
  liquidityDamageLimit: z.number(),
  isPartialAllowed: z.boolean().default(false),
  paymentReleasePeriod: z.number(),
  contractTerms: z.array(z.string()).optional(),
});

type ContractConditionsSchema = z.infer<typeof schema>;

export default function ContractConditionsForm() {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContractConditionsSchema>({ resolver: zodResolver(schema) });
  const { id } = useParams();

  const [createContractConditions, { isLoading: isCreatingConditons }] =
    useCreateMutation();
  const [updateContractConditions, { isLoading: isUpdateConditons }] =
    useUpdateMutation();
  const [
    getContractConditions,
    { data: contractConditions, isLoading: isGettingConditions },
  ] = useLazyListByIdQuery();

  const onSubmit = async (data: ContractConditionsSchema) => {
    try {
      if (contractConditions?.items?.[0]) {
        await updateContractConditions({
          ...data,
          id: contractConditions?.items?.[0]?.id,
          rfxId: id,
        }).unwrap();
      } else {
        await createContractConditions({ ...data, rfxId: id }).unwrap();
      }
      notifications.show({
        title: 'Success',
        message: 'Contract conditions saved successfully',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err?.message?.data,
        color: 'red',
      });
    }
  };
  const onError = (err: any) => {
    logger.log(err);
  };

  useEffect(() => {
    getContractConditions({ id: id.toString(), collectionQuery: {} });
  }, []);

  useEffect(() => {
    reset(contractConditions?.items?.[0] ?? {});
  }, [contractConditions]);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack>
        <LoadingOverlay visible={isGettingConditions} />
        <Flex className="gap-4">
          {/* <Controller
            name="warrantyPeriod"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                label="Warranty Period (in days)"
                placeholder="Warranty Period (in days)"
                value={value}
                className="w-full"
                suffix=" days"
                allowNegative={false}
                onChange={onChange}
                error={errors?.warrantyPeriod?.message}
                withAsterisk
              />
            )}
          /> */}
          <Controller
            name="liquidityDamage"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                label="Liquidity Damage (in %)"
                placeholder="Liquidity Damage (in %)"
                value={value}
                className="w-full"
                suffix=" %"
                min={0}
                max={100}
                onChange={onChange}
                error={errors?.liquidityDamage?.message}
                withAsterisk
              />
            )}
          />
          <Controller
            name="liquidityDamageLimit"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                label="Liquidity Damage Limit (in %)"
                placeholder="Liquidity Damage Limit (in %)"
                value={value}
                className="w-full"
                suffix=" %"
                min={0}
                max={100}
                onChange={onChange}
                error={errors?.liquidityDamageLimit?.message}
                withAsterisk
              />
            )}
          />
        </Flex>
        <Flex className="gap-4">
          {/* <Controller
            name="paymentMode"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <MultiSelect
                name={name}
                label="Payment Mode"
                placeholder="Payment Mode"
                data={['Cash', 'Bank', 'Check']}
                value={value}
                className="w-full"
                onChange={onChange}
                error={errors?.paymentMode?.message}
                withAsterisk
              />
            )}
          /> */}
        </Flex>
        <Flex className="gap-4">
          <Controller
            name="paymentReleasePeriod"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                label="Payment Release Period After Invoicing (in days)"
                placeholder="Payment Release Period After Invoicing (in days)"
                value={value}
                className="w-[calc(50%-0.5rem)]"
                onChange={onChange}
                suffix=" days"
                allowNegative={false}
                error={errors?.paymentReleasePeriod?.message}
                withAsterisk
              />
            )}
          />
          <Controller
            name="contractTerms"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <MultiSelect
                label="Contract terms"
                placeholder="Please select contract terms"
                name={name}
                value={value}
                onChange={onChange}
                className="w-[calc(50%-0.5rem)]"
                data={[
                  'Payment will be 30 days after delivery.',
                  'Vendor shall provide 1 year warranty.',
                  'Vendor shall provide item at specified date.',
                ]}
                error={errors?.contractTerms?.message}
              />
            )}
          />
        </Flex>
        <Controller
          name="isPartialAllowed"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Switch
              name={name}
              label="Is Partial Payment Allowed?"
              checked={value}
              onChange={(event) =>
                setValue('isPartialAllowed', event.currentTarget.checked)
              }
            />
          )}
        />
        <Flex className="ml-auto">
          <Button
            leftSection={<IconDeviceFloppy />}
            type="submit"
            loading={isCreatingConditons || isUpdateConditons}
          >
            Save
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
