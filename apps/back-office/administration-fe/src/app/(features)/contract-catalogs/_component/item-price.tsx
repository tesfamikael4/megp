import { useGetCurrenciesQuery } from '@/store/api/administration/administration.api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  NumberInput,
  Button,
  Select,
  Stack,
  TextInput,
  Flex,
  Group,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Section, logger, notify } from '@megp/core-fe';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateContractItemPriceMutation,
  useReadContractItemPriceQuery,
  useUpdateContractItemPriceMutation,
} from '@/store/api/contract-catalog/contract-catalog.api';
import { useParams, useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
interface Price {
  unitPrice: number;
  location: string;
  deliveryDate: Date;
  currency: string;
}

export default function ContractItemPrice() {
  const ContractItemSchema: ZodType<Partial<Price>> = z.object({
    unitPrice: z.number().min(1, { message: 'Unit Price is required' }),
    location: z.string().min(1, { message: 'Location is required' }),
    deliveryDate: z
      .date()
      .min(new Date(), { message: 'Delivery Date is required' }),
    currency: z
      .string()
      .min(1, { message: 'Currency is required' })
      .default('MKW'),
  });

  const {
    handleSubmit,

    formState: { errors },
    control,

    register,
  } = useForm({
    resolver: zodResolver(ContractItemSchema),
  });

  const route = useRouter();
  const { itemId } = useParams();

  const { data: currency } = useGetCurrenciesQuery(null);
  const [createPrice] = useCreateContractItemPriceMutation();
  const { data: contractItemPrice } = useReadContractItemPriceQuery(
    itemId?.toString(),
  );
  const [update] = useUpdateContractItemPriceMutation();

  const onCreate = async (data: Price) => {
    try {
      await createPrice({ ...data, contactItemId: itemId }).unwrap();
      notify('Success', 'Contract Item Price created successfully');
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };
  const onUpdate = async (data: Price) => {
    try {
      await update({ ...data, contactItemId: itemId }).unwrap();
      notify('Success', 'Contract Item Price updated successfully');
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };

  logger.log('contractItemPrice', contractItemPrice);

  return (
    <Section
      title={
        <Flex>
          <IconArrowLeft className="me-4" onClick={() => route.back()} />
          Define Contract Item Price
        </Flex>
      }
      collapsible={false}
    >
      <Stack className="w-full">
        <Flex gap={'sm'}>
          <Box className="w-1/2">
            <Controller
              name="unitPrice"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Unit Price"
                  placeholder="Enter unit price"
                  error={errors.unitPrice?.message?.toString()}
                  {...field}
                />
              )}
            />

            <TextInput
              label="Location"
              placeholder="Enter location"
              error={errors.location?.message?.toString()}
              {...register('location')}
            />
          </Box>
          <Box className="w-1/2">
            <Controller
              name="deliveryDate"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DateInput
                  label="Delivery Date"
                  value={value}
                  onChange={onChange}
                  placeholder="Enter delivery date"
                  error={errors.deliveryDate?.message?.toString() ?? ''}
                />
              )}
            />
            <Controller
              name="currency"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <Select
                  withCheckIcon={false}
                  name={name}
                  value="MKW"
                  onChange={onChange}
                  label="Currency"
                  data={currency?.items?.map((c) => c.abbreviation) ?? []}
                  className="w-full"
                  withAsterisk
                  searchable
                  error={errors?.currency?.message?.toString()}
                  disabled
                />
              )}
            />
          </Box>
        </Flex>
        <Group>
          {contractItemPrice == undefined || contractItemPrice == null ? (
            <Button onClick={handleSubmit(onCreate)}>Save</Button>
          ) : (
            <Button onClick={handleSubmit(onUpdate)}>Update</Button>
          )}
        </Group>
      </Stack>
    </Section>
  );
}
