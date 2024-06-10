import {
  Avatar,
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
  useAcceptInvitationMutation,
  useAddItemOfferMutation,
  useGetItemOfferQuery,
  useModifyItemOfferMutation,
  useWithdrawInvitationMutation,
} from '../../../_api/items.api';
import { useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { logger, notify } from '@megp/core-fe';
import { useRfxDetailQuery } from '@/app/(features)/my-workspace/_api/invitation-registration.api';
import { IconAward } from '@tabler/icons-react';

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
  const { data: selected } = useRfxDetailQuery(rfxId?.toString());

  const { data: itemOffer } = useGetItemOfferQuery({
    id: product?.id.toString(),
  });
  const [createItemOffer, { isLoading: isCreatingItemOffer }] =
    useAddItemOfferMutation();
  const [updateItemOffer, { isLoading: isUpdatingItemOffer }] =
    useModifyItemOfferMutation();
  const [acceptInvitation, { isLoading: isAcceptingInvitation }] =
    useAcceptInvitationMutation();
  const [withdrawInvitation, { isLoading: isWithdrawingInvitation }] =
    useWithdrawInvitationMutation();
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
          rfxProductInvitationId: product?.id.toString(),
          rfxItemId: product?.rfxItem?.id,
        }).unwrap();
      } else {
        await updateItemOffer({
          ...data,
          rfxProductInvitationId: product?.id.toString(),
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
      value: product?.catalogueDeliveryValues?.[0]?.address ?? 'Linogwe',
    },
    {
      key: 'Delivery Days',
      value: product?.catalogueDeliveryValues?.[0]?.deliverDays ?? '',
    },
  ];

  useEffect(() => {
    if (itemOffer) {
      reset(itemOffer);
    }
  }, [itemOffer]);

  useEffect(() => {
    if (watch('price') && watch('tax')) {
      const totalPrice = watch('price') * (1 + watch('tax') / 100);
      setValue('totalPrice', totalPrice);
    }
  }, [watch('price'), watch('tax')]);

  const handleAccept = async () => {
    try {
      await acceptInvitation({ invitationId: product?.id }).unwrap();
      notify('Success', 'Invitation accepted successfully.');
    } catch (err) {
      notify('Error', 'Invitation acceptance failed.');
    }
  };
  const handleWithdraw = async () => {
    try {
      await withdrawInvitation({ invitationId: product?.id }).unwrap();
      notify('Success', 'Invitation withdrawn successfully.');
    } catch (err) {
      notify('Error', 'Invitation withdrawn failed.');
    }
  };

  const lastOffer = product?.openedOffers?.length - 1;
  const openedOffer = product?.openedOffers;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper withBorder shadow="sm" className="bg-neutral-100">
        <Stack className="p-4">
          {showAction == false ? null : product?.status == 'APPROVED' ||
            product?.status == 'WITHDRAWN' ? (
            <Button
              onClick={handleAccept}
              loading={isAcceptingInvitation}
              className="ml-auto"
            >
              Accept Invitation
            </Button>
          ) : product?.status == 'ACCEPTED' ? (
            <Button
              className="bg-red-600 ml-auto"
              loading={isWithdrawingInvitation}
              onClick={handleWithdraw}
            >
              Withdraw
            </Button>
          ) : null}
          {selected?.status == 'ENDED' &&
            openedOffer?.[lastOffer]?.rank == 1 && (
              <Paper className="p-y-2 px-6 rounded-sm" withBorder>
                <Flex className="items-center gap-4">
                  <IconAward color="green" />
                  <Text c="green">
                    Congratulations! You have been announced winner for this
                    item.
                  </Text>
                </Flex>
              </Paper>
            )}
          {selected?.status == 'ENDED' && (
            <Paper withBorder className="py-2 px-4 rounded-sm">
              <Flex className="items-center gap-2">
                <Avatar color="blue">{openedOffer?.[lastOffer]?.rank}</Avatar>
                You ranked at {openedOffer?.[lastOffer]?.rank} with price of{' '}
                {openedOffer?.[lastOffer]?.price?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'MKW',
                })}{' '}
                .
              </Flex>
            </Paper>
          )}
          {product?.rfxItem.solRoundAwards?.[0] &&
            selected?.status != 'ENDED' && (
              <Stack>
                <Flex className="gap-2 items-center">
                  <Avatar>{openedOffer?.[lastOffer]?.rank}</Avatar>
                  <Text className="text-gray-600">You ranked at: </Text>
                  <Text>
                    {openedOffer?.[lastOffer]?.rank}
                    with price of:{' '}
                  </Text>
                  <Text>
                    {openedOffer?.[lastOffer]?.price?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'MKW',
                    })}{' '}
                    at the previous round.
                  </Text>
                </Flex>
                <Flex className="gap-2">
                  <Text className="text-gray-600">
                    Last Round winning price:
                  </Text>
                  <Text>
                    MKW{' '}
                    {product?.rfxItem?.solRoundAwards?.[0]?.winnerPrice?.toLocaleString(
                      'en-US',
                      { style: 'currency', currency: 'MKW' },
                    )}
                  </Text>
                </Flex>
                <Flex className="gap-2">
                  <Text className="text-gray-600">
                    Next Round starting price:
                  </Text>
                  <Text>
                    MKW{' '}
                    {product?.rfxItem?.solRoundAwards?.[0]?.nextRoundStartingPrice?.toLocaleString(
                      'en-US',
                      { style: 'currency', currency: 'MKW' },
                    )}
                  </Text>
                </Flex>
              </Stack>
            )}
          <DetailTable data={config} />
          {product?.status == 'NOT_COMPLY' && (
            <Text>You have failed one or more compliance check.</Text>
          )}
          {showAction == false ||
          selected?.status == 'ENDED' ? null : product?.status == 'ACCEPTED' ||
            product?.status == 'COMPLY' ? (
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
                      prefix="MKW "
                      value={value}
                      className="w-full"
                      onChange={onChange}
                      max={parseInt(
                        product?.solRoundAwards?.[0]?.nextRoundStartingPrice ??
                          100000000000,
                      )}
                      clampBehavior="strict"
                      thousandSeparator=","
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
                      prefix="MKW "
                      value={value}
                      className="w-[calc(50%-0.5rem)]"
                      onChange={onChange}
                      error={errors?.totalPrice?.message}
                      thousandSeparator=","
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
          ) : null}
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
