import {
  ITenderPreparation,
  TenderCurrency,
} from '@/models/tender/bid-procedures/preparation.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/bid-preparation.api';
import { notify } from '@megp/core-fe';

export default function PreparationDetail() {
  const { id } = useParams();
  const PreparationSchema: ZodType<Partial<ITenderPreparation>> = z.object({
    incotermsEdition: z.string().min(1, { message: 'This field is required' }),
    currencyOfTheBidForNationalBidders: z.object({
      localInput: z.enum([
        Object.values(TenderCurrency)[0],
        ...Object.values(TenderCurrency).slice(0),
      ]),
      importedInput: z.enum([
        Object.values(TenderCurrency)[0],
        ...Object.values(TenderCurrency).slice(0),
      ]),
    }),
    currencyOfTheBidForInternationalBidders: z.object({
      localInput: z.enum([
        Object.values(TenderCurrency)[0],
        ...Object.values(TenderCurrency).slice(0),
      ]),
      importedInput: z.enum([
        Object.values(TenderCurrency)[0],
        ...Object.values(TenderCurrency).slice(0),
      ]),
    }),
    incotermType: z.enum(['DDP']),
    bidValidityPeriod: z
      .number()
      .min(1, { message: 'This field is required ' }),
  });

  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(PreparationSchema),
  });

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Bid Preparation created successfully');
    } catch (err) {
      notify('Error', 'Error in creating bid preparation');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: id?.toString(),
      });
      notify('Success', 'Bid Preparation updated successfully');
    } catch {
      notify('Error', 'Error in updating bid preparation');
    }
  };

  useEffect(() => {
    if (selected && isSuccess) {
      reset({
        currencyOfTheBidForNationalBidders:
          selected.currencyOfTheBidForNationalBidders,
        currencyOfTheBidForInternationalBidders:
          selected.currencyOfTheBidForInternationalBidders,
        incotermsEdition: selected.incotermsEdition,
        incotermType: 'DDP',
        bidValidityPeriod: selected.bidValidityPeriod,
      });
    }
  }, [reset, selected, isSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <div className="flex space-x-4">
        <Controller
          name="currencyOfTheBidForNationalBidders.localInput"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              placeholder="National Bidder Currency  For Local Inputs"
              withAsterisk
              name={name}
              className="w-1/2"
              value={value}
              onChange={(d) => onChange(d)}
              label="National Bidder Currency For Local Inputs"
              data={Object.values(TenderCurrency)}
              error={
                errors['currencyOfTheBidForNationalBidders']
                  ? errors['currencyOfTheBidForNationalBidders'][
                      'localInput'
                    ]?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="currencyOfTheBidForNationalBidders.importedInput"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              placeholder="National Bidder Currency  For Imported Inputs"
              withAsterisk
              name={name}
              className="w-1/2"
              value={value}
              onChange={(d) => onChange(d)}
              label="National Bidder Currency For Imported Inputs"
              data={Object.values(TenderCurrency)}
              error={
                errors['currencyOfTheBidForNationalBidders']
                  ? errors['currencyOfTheBidForNationalBidders'][
                      'importedInput'
                    ]?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </div>
      <div className="flex space-x-4">
        <Controller
          name="currencyOfTheBidForInternationalBidders.localInput"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              placeholder="International Bidder Currency For Local Input"
              withAsterisk
              name={name}
              className="w-1/2"
              value={value}
              onChange={(d) => onChange(d)}
              label="International Bidder Currency  For Local Input"
              data={Object.values(TenderCurrency)}
              error={
                errors['currencyOfTheBidForInternationalBidders']
                  ? errors['currencyOfTheBidForInternationalBidders'][
                      'localInput'
                    ]?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="currencyOfTheBidForInternationalBidders.importedInput"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              placeholder="International Bidder Currency For Imported Inputs"
              withAsterisk
              name={name}
              className="w-1/2"
              value={value}
              onChange={(d) => onChange(d)}
              label="International Bidder Currency  For Imported Inputs"
              data={Object.values(TenderCurrency)}
              error={
                errors['currencyOfTheBidForInternationalBidders']
                  ? errors['currencyOfTheBidForInternationalBidders'][
                      'importedInput'
                    ]?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </div>
      <div className="flex space-x-4">
        <TextInput
          label="Incoterms Edition"
          withAsterisk
          className="w-1/2"
          error={
            errors?.incotermsEdition
              ? errors?.incotermsEdition?.message?.toString()
              : ''
          }
          {...register('incotermsEdition')}
        />
        <NativeSelect
          placeholder="Incoterm Type"
          withAsterisk
          className="w-1/2"
          label="Incoterm Type"
          data={['DDP']}
          {...register('incotermType')}
        />
      </div>
      <div className="w-full flex space-x-4">
        <Controller
          name="bidValidityPeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Bid Validity Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['bidValidityPeriod']
                  ? errors['bidValidityPeriod']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />
      </div>
      <EntityButton
        mode={selected ? 'detail' : 'new'}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}
