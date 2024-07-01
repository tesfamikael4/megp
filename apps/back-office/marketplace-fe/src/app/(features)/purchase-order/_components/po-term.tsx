import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Checkbox, Flex, Stack, TagsInput } from '@mantine/core';
import { Section, logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useCreateMutation,
  useUpdateMutation,
  useReadQuery,
  useDeleteMutation,
  useLazyListByIdQuery,
  useLazyReadQuery,
} from '../_api/po-terms.api';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

interface Term {
  warrantyPeriod: number;
  liquidityDamage: number;
  liquidityDamageLimit: number;
  paymentTerms: string[];
  terms: string[];
  deliveryPeriod: number;
  isPartialPaymentAllowed: boolean;
}
export default function PoTerm() {
  const termsSchema = z.object({
    warrantyPeriod: z.coerce
      .number()
      .positive()
      .min(1, { message: 'This field is required' }),
    liquidityDamage: z.coerce
      .number()
      .positive()
      .min(1, { message: 'This field is required' }),
    liquidityDamageLimit: z.coerce
      .number()
      .positive()
      .min(1, { message: 'This field is required' }),
    paymentTerms: z.string().min(1, { message: 'This field is required' }),
    terms: z.array(z.string()),
    deliveryPeriod: z.coerce
      .number()
      .int()
      .positive()
      .min(1, { message: 'This field is required' }),
    isPartialPaymentAllowed: z.boolean().default(false),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    control,
  } = useForm<Term>({
    resolver: zodResolver(termsSchema),
  });

  const { id } = useParams();

  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [trigger, { data: terms }] = useLazyListByIdQuery();
  const [triggerTerm, { data: term, isSuccess }] = useLazyReadQuery();

  const onCreate = async (data: Term) => {
    try {
      await create({ ...data, purchaseOrderId: id as string }).unwrap();
      notify('Success', 'Purchase Order terms created successfully');
    } catch {
      notify('Error', 'Failed to create Purchase Order terms');
    }
  };
  const onUpdate = async (data: Term) => {
    try {
      await update({ ...data, id: term?.id }).unwrap();
      notify('Success', 'Purchase Order terms updated successfully');
    } catch {
      notify('Error', 'Failed to update Purchase Order terms');
    }
  };
  const onDelete = async () => {
    try {
      await remove(term?.id).unwrap();
      notify('Success', 'Purchase Order terms deleted successfully');
    } catch {
      notify('Error', 'Failed to delete Purchase Order terms');
    }
  };

  useEffect(() => {
    if (terms?.total !== 0) {
      reset({
        ...term,
      });
    }
  }, [reset, term, terms]);

  useEffect(() => {
    trigger({ id: id?.toString(), collectionQuery: undefined });
  }, [id, isSuccess]);

  useEffect(() => {
    triggerTerm(terms?.items[0]?.id);
  }, [terms]);

  const onError = (err) => {
    logger.log(err);
  };

  return (
    <Section title="Terms" collapsible={false}>
      <Stack pos={'relative'}>
        <Flex gap="md" pos={'relative'}>
          <Flex direction={'column'} gap={'sm'} className="w-1/2">
            <TextInput
              withAsterisk
              label="Warranty Period (days)"
              {...register('warrantyPeriod')}
              rightSection={'days'}
              type="number"
              error={(errors.warrantyPeriod?.message as string) ?? ''}
            />
            <TextInput
              withAsterisk
              label="Liquidity Damage"
              {...register('liquidityDamage')}
              rightSection={'%'}
              type="number"
              error={(errors.liquidityDamage?.message as string) ?? ''}
            />

            <TextInput
              // onChange={onChange}
              label="Liquidity Damage Limit"
              className="w-full"
              withAsterisk
              {...register('liquidityDamageLimit')}
              rightSection={'%'}
              type="number"
              error={(errors.liquidityDamageLimit?.message as string) ?? ''}
            />
            <Checkbox
              label="Is Partial Payment Allowed?"
              {...register('isPartialPaymentAllowed')}
            />
          </Flex>
          <Flex direction={'column'} gap={'sm'} className="w-1/2">
            <Controller
              name="terms"
              control={control}
              render={({ field: { value, name, onChange } }) => (
                <TagsInput
                  label="Terms"
                  name={name}
                  value={value}
                  onChange={onChange}
                  withAsterisk
                  placeholder="Terms"
                  error={errors.terms?.message as string | undefined}
                />
              )}
            />
            <TextInput
              withAsterisk
              label="Payment Terms"
              {...register('paymentTerms')}
              error={(errors?.paymentTerms?.message as string) ?? ''}
            />
            <TextInput
              label="Delivery Period "
              {...register('deliveryPeriod')}
              error={errors.deliveryPeriod?.message}
              rightSection={'days'}
              type="number"
            />
          </Flex>
        </Flex>

        <EntityButton
          mode={terms?.total == 0 ? 'new' : 'detail'}
          // onReset={onReset}
          onCreate={handleSubmit(onCreate, onError)}
          onUpdate={handleSubmit(onUpdate)}
          onDelete={handleSubmit(onDelete)}
          // disabled={disableFields}
          isSaving={isCreating}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </Stack>
    </Section>
  );
}
