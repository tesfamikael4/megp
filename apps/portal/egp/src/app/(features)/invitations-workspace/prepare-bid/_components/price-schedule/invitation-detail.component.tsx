import {
  Badge,
  Button,
  Flex,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DetailTable } from '@/app/(features)/_components/detail-table/detail-table';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  IconChevronDown,
  IconChevronUp,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import {
  useAddItemOfferMutation,
  useGetItemOfferQuery,
  useModifyItemOfferMutation,
} from '../../../_api/items.api';
import { useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { logger } from '@megp/core-fe';

const schema = z.object({
  price: z.number(),
  tax: z.number(),
  totalPrice: z.number(),
});

type FormSchema = z.infer<typeof schema>;

export default function InvitationDetail({
  product,
  showAction,
}: {
  product: any;
  showAction?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const { rfxId } = useParams();

  const { data: itemOffer } = useGetItemOfferQuery({
    id: product?.id.toString(),
  });
  const [createItemOffer, { isLoading: isCreatingItemOffer }] =
    useAddItemOfferMutation();
  const [updateItemOffer, { isLoading: isUpdatingItemOffer }] =
    useModifyItemOfferMutation();
  const [showDetail, setShowDetail] = useState(false);

  const specificationDetails = Object.entries(
    product?.catalogueSpecificationValues || {},
  )
    .filter(([key]) => key !== 'url')
    .map(([key, value]) => ({
      key: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
      value: value ?? '',
    }));

  const onSubmit = async (data: FormSchema) => {
    try {
      if (!(itemOffer?.items?.[0]?.length > 0)) {
        await createItemOffer({
          ...data,
          roundId: '8e0d9a06-a15c-4403-b160-d55127402d56',
          invitationId: product?.id.toString(),
          rfxItemId: product?.rfxItem?.id,
        }).unwrap();
      } else {
        await updateItemOffer({
          ...data,
          roundId: '8e0d9a06-a15c-4403-b160-d55127402d56',
          invitationId: product?.id.toString(),
          rfxItemId: product?.rfxItem?.id,
        }).unwrap();
      }
      notifications.show({
        title: 'Success',
        message: 'Item offer saved successfully.',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err?.data?.message,
        color: 'red',
      });
    }
  };

  const config = [
    {
      key: 'Item Name',
      value: product?.rfxItem?.name,
    },
    {
      key: 'Quantity',
      value: product?.rfxItem?.quantity,
    },
    {
      key: 'Unit of measure',
      value: product?.rfxItem?.unitOfMeasure,
    },
    {
      key: 'Delivery Location',
      value: product?.catalogueDeliveryValues?.[0]?.address ?? '',
    },
  ];

  useEffect(() => {
    if (itemOffer) {
      reset(itemOffer?.[0]?.items);
    }
  }, [itemOffer]);

  useEffect(() => {
    if (watch('price') && watch('tax')) {
      const totalPrice = watch('price') * (1 + watch('tax') / 100);
      setValue('totalPrice', totalPrice);
    }
  }, [watch('price'), watch('tax')]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper withBorder shadow="sm" className="bg-neutral-100">
        <Stack className="p-4">
          {showAction == false ? null : (
            <Button className="bg-red-600 ml-auto">Withdraw</Button>
          )}
          <DetailTable data={config} />
          {showAction == false ? null : (
            <Stack>
              <Flex className="gap-4">
                <Controller
                  name="price"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <NumberInput
                      name={name}
                      label="Price"
                      placeholder="Price"
                      value={value}
                      className="w-full"
                      onChange={onChange}
                      error={errors?.price?.message}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="tax"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <NumberInput
                      name={name}
                      label="Tax (in %)"
                      placeholder="Tax (in %)"
                      value={value}
                      className="w-full"
                      onChange={onChange}
                      max={100}
                      error={errors?.tax?.message}
                      withAsterisk
                    />
                  )}
                />
              </Flex>
              <Flex>
                <Controller
                  name="totalPrice"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <NumberInput
                      name={name}
                      label="Total Price"
                      placeholder="Total Price"
                      value={value}
                      className="w-[calc(50%-0.5rem)]"
                      onChange={onChange}
                      error={errors?.totalPrice?.message}
                      withAsterisk
                      disabled
                    />
                  )}
                />
              </Flex>
              <Button
                leftSection={<IconDeviceFloppy />}
                className="ml-auto"
                type="submit"
                loading={isCreatingItemOffer || isUpdatingItemOffer}
              >
                Save Changes
              </Button>
            </Stack>
          )}
          <Badge
            className="mx-auto cursor-pointer"
            onClick={() => setShowDetail(!showDetail)}
            leftSection={showDetail ? <IconChevronUp /> : <IconChevronDown />}
          >
            {showDetail ? 'Show Less' : 'See item specification'}
          </Badge>
          {showDetail && (
            <Stack>
              <Text>Technical Specification</Text>
              <DetailTable data={specificationDetails as any} />
            </Stack>
          )}
        </Stack>
      </Paper>
    </form>
  );
}
