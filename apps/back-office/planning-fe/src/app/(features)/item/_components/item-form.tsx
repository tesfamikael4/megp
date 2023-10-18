import { Checkbox, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';

import { Controller, useForm } from 'react-hook-form';
import {
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
  useReadQuery,
} from '../_api/item.api';
import { Item } from '@/models/item';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useListQuery as usePrebudgetListQuery } from '../../pre-budget-plan/_api/pre-budget-plan.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  prebudgetId: '',
  itemCodeReferenceType: ',',
  itemCode: '',
  itemCodeDescription: '',
  itemSpecification: '',
  price: '',
  quantity: '',
  uOMId: '',
  indigenousPreference: false,
  MSME: '',
  marginalizedGroups: '',
  currency: '',
  procurementMethodId: '',
  procurementCategoryId: '',
  procurementStatus: '',
  frameworkContractId: '',
  frameworkContract: {
    id: '',
    contractId: '',
    contractNo: '',
    quantity: 0,
    price: 0,
  },
  fundingSource: '',
  donorId: '',
  donorName: '',
};

export function ItemForm({ mode }: FormDetailProps) {
  const itemSchema: ZodType<Partial<Item>> = z.object({
    prebudgetId: z.string().min(1, { message: 'This field is required' }),
    donorId: z.string().min(1, { message: 'This field is required' }),
    donorName: z.string().min(1, { message: 'This field is required' }),
    itemCodeReferenceType: z
      .string()
      .min(1, { message: 'This field is required' }),
    itemCode: z.string().min(1, { message: 'This field is required' }),

    itemCodeDescription: z
      .string()
      .min(1, { message: 'This field is required' }),
    itemSpecification: z.string().min(1, { message: 'This field is required' }),
    price: z.string().min(1, { message: 'This field is required' }),

    quantity: z.string().min(1, { message: 'This field is required' }),
    uOMId: z.string().min(1, { message: 'This field is required' }),
    uOM: z.object({
      id: z.string().min(1, { message: 'This field is required' }),
      name: z.string().min(1, { message: 'This field is required' }),
      description: z.string().min(1, { message: 'This field is required' }),
      category: z.string().min(1, { message: 'This field is required' }),
    }),
    indigenousPreference: z.boolean().optional(),
    MSME: z.string().optional(),
    marginalizedGroups: z.string().optional(),
    currency: z.string().min(1, { message: 'This field is required' }),
    procurementCategoryId: z
      .string()
      .min(1, { message: 'This field is required' }),
    procurementCategory: z.object({
      id: z.string().min(1, { message: 'This field is required' }),
      name: z.string().min(1, { message: 'This field is required' }),
      description: z.string().min(1, { message: 'This field is required' }),
    }),

    procurementMethodId: z
      .string()
      .min(1, { message: 'This field is required' }),
    procurementMethod: z.object({
      id: z.string().min(1, { message: 'This field is required' }),
      name: z.string().min(1, { message: 'This field is required' }),
      description: z.string().min(1, { message: 'This field is required' }),
    }),
    frameworkContractId: z
      .string()
      .min(1, { message: 'This field is required' }),
    frameworkContract: z.object({
      id: z.string().min(1, { message: 'This field is required' }),
      contractId: z.string().min(1, { message: 'This field is required' }),
      contractNo: z.string().min(1, { message: 'This field is required' }),
      quantity: z.number().min(1, { message: 'This field is required' }),
      price: z.number().min(1, { message: 'This field is required' }),
    }),
    fundingSource: z.string().min(1, { message: 'This field is required' }),
    procurementStatus: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<Item>({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });

  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );
  const { data: prebudget } = usePrebudgetListQuery();

  const category = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'Operational',
      description: 'string',
    },
  ];
  const method = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'Tendering',
      description: 'string',
    },
  ];
  const contract = {
    id: 'd9102562-6372-11ee-8c99-0242ac120002',
    contractId: 'd9102698-6372-11ee-8c99-0242ac120002',
    contractNo: 'No1223344',
    quantity: 200,
    price: 22.4,
  };
  const measure = [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      category: 'Count',
      name: 'Count',
      description: 'string',
    },
  ];

  const onCreate = async (data) => {
    const rawData: any = {
      ...data,
      price: +data.price,
      quantity: +data.quantity,
      MSME: +data.MSME,
      marginalizedGroups: +data.marginalizedGroups,
    };

    try {
      const result = await create(rawData);
      if ('data' in result) {
        router.push(`/item/${result.data.id}`);
      }
      notifications.show({
        message: 'Item created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'error in creating item',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
      });
      notifications.show({
        message: 'Item updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'error in updating item',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notifications.show({
        message: 'Item deleted successfully',
        title: 'Success',
      });
      router.push('/item');
    } catch {
      notifications.show({
        message: 'error in deleting item',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        fundingSource: selected?.fundingSource,
        indigenousPreference: selected?.indigenousPreference,
        MSME: selected?.MSME.toString(),
        marginalizedGroups: selected?.marginalizedGroups.toString(),
        itemCode: selected?.itemCode,
        itemCodeDescription: selected?.itemCodeDescription,
        itemSpecification: selected?.itemSpecification,
        currency: selected?.currency,
        price: selected?.price,
        quantity: selected?.quantity.toString(),
      });
      setValue('prebudgetId', selected?.prebudgetId);
      setValue('procurementCategoryId', selected?.procurementCategoryId);
      setValue('procurementMethodId', selected?.procurementMethodId);
      setValue('frameworkContractId', selected?.frameworkContractId);
      setValue('uOMId', selected?.uOMId);
      setValue('uOM', selected?.uOM);
      setValue('itemCodeReferenceType', selected?.itemCodeReferenceType);
    }
  }, [mode, reset, selected, selectedSuccess, setValue]);

  useEffect(() => {
    setValue('donorId', '3fa85f64-5717-4562-b3fc-2c963f66afa6');
    setValue('donorName', 'Bill Mike S.C');
    setValue('procurementCategoryId', 'd9101fd6-6372-11ee-8c99-0242ac120002');
    setValue('procurementCategory', category[0]);
    setValue('procurementMethodId', 'd9101fd6-6372-11ee-8c99-0242ac120002');
    setValue('procurementMethod', method[0]);
    setValue('frameworkContractId', 'd9101fd6-6372-11ee-8c99-0242ac120002');
    setValue('frameworkContract', contract);
    setValue('uOMId', 'd9101fd6-6372-11ee-8c99-0242ac120002');
    setValue('uOM', measure[0]);
    setValue('procurementStatus', 'tobefunded');
  });

  return (
    <Stack>
      <Controller
        name="prebudgetId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Prebudget Plan"
            required
            error={
              errors?.prebudgetId
                ? errors?.prebudgetId?.message?.toString()
                : ''
            }
            value={value}
            onChange={onChange}
            data={
              prebudget?.items?.map((type) => ({
                value: type?.id,
                label: type?.procurementReference,
              })) || []
            }
          />
        )}
      />
      <Controller
        name="itemCodeReferenceType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Item Code Reference Type"
            error={
              errors?.itemCodeReferenceType
                ? errors?.itemCodeReferenceType?.message?.toString()
                : ''
            }
            value={value}
            onChange={onChange}
            data={[
              { label: 'Price Index', value: 'Price Index' },
              { label: 'UNSPSC_CodeSet', value: 'UNSPSC_CodeSet ' },
              { label: 'CPV_CodeSet', value: 'CPV_CodeSet' },
            ]}
          />
        )}
      />
      <TextInput
        withAsterisk
        label="Item Code "
        error={errors?.itemCode ? errors?.itemCode?.message?.toString() : ''}
        required
        {...register('itemCode')}
      />
      <Textarea
        withAsterisk
        minRows={2}
        label="Item Code Description"
        error={
          errors?.itemCodeDescription
            ? errors?.itemCodeDescription?.message?.toString()
            : ''
        }
        required
        {...register('itemCodeDescription')}
      />
      <TextInput
        withAsterisk
        label="Item Code Specification"
        error={
          errors?.itemSpecification
            ? errors?.itemSpecification?.message?.toString()
            : ''
        }
        required
        {...register('itemSpecification')}
      />
      <TextInput
        type="number"
        withAsterisk
        label="Unit Price"
        error={errors?.price ? errors?.price?.message?.toString() : ''}
        required
        {...register('price')}
      />
      <TextInput
        type="number"
        withAsterisk
        label="Qunatity"
        error={errors?.quantity ? errors?.quantity?.message?.toString() : ''}
        required
        {...register('quantity')}
      />

      <Controller
        name="uOMId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Unit of Measure"
            error={errors?.uOMId ? errors?.uOMId?.message?.toString() : ''}
            value={value}
            onChange={onChange}
            data={
              measure?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />
      <Checkbox label="Indigenous Preference" />
      <TextInput
        type="number"
        label="MSME Percentage "
        error={errors?.MSME ? errors?.MSME?.message?.toString() : ''}
        {...register('MSME')}
      />
      <TextInput
        type="number"
        label="Marginalized Groups "
        error={
          errors?.marginalizedGroups
            ? errors?.marginalizedGroups?.message?.toString()
            : ''
        }
        {...register('marginalizedGroups')}
      />
      <Controller
        name="currency"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Currency"
            error={
              errors?.currency ? errors?.currency?.message?.toString() : ''
            }
            value={value}
            onChange={onChange}
            data={[
              { label: 'Kwacha', value: 'Kwacha' },
              { label: 'USD', value: 'USD' },
              { label: 'Euros', value: 'Euros' },
            ]}
          />
        )}
      />
      <Controller
        name="procurementCategoryId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Procurement Type"
            error={
              errors?.procurementCategoryId
                ? errors?.procurementCategoryId?.message?.toString()
                : ''
            }
            value={value}
            onChange={onChange}
            data={
              category?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />
      <Controller
        name="procurementMethodId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Procurement Method"
            error={
              errors?.procurementMethodId
                ? errors?.procurementMethodId?.message?.toString()
                : ''
            }
            value={value}
            onChange={onChange}
            data={
              method?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />
      <Controller
        name="fundingSource"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Funding Source"
            error={
              errors?.fundingSource
                ? errors?.fundingSource?.message?.toString()
                : ''
            }
            value={value}
            onChange={onChange}
            data={[
              { label: 'Budget', value: 'Budget' },
              { label: 'Grant', value: 'Grant' },
              { label: 'Own Fund', value: 'OwnFund' },
            ]}
          />
        )}
      />

      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}
