'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Select,
  Stack,
  Title,
} from '@mantine/core';
import { IconCirclePlus, IconCross, IconMinus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useGetRegionsQuery,
  useLazyGetDistrictsQuery,
} from '../_api/catalog.api';

interface DeliverDays {
  quantity: number;
  deliverDays: number;
  district: string;
}
export const DeliverDaysForm = () => {
  const schema: ZodType<Partial<DeliverDays>> = z.object({
    quantity: z.coerce.number().optional(),
    deliverDays: z.coerce.number(),
    district: z.string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    }),
  });

  const [selectedRegion, setSelectedRegion] = useState<any>();
  const { data: regions } = useGetRegionsQuery(undefined);
  const [triggerDistrict, { data: districts }] = useLazyGetDistrictsQuery();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [deliverDays, setDeliverDays] = useState<any[]>([]);

  function onCreate() {
    throw new Error('Function not implemented.');
  }

  function OnDelete(): void {
    throw new Error('Function not implemented.');
  }

  // setSelectedRegion(catalog?.deliveryValues?.[0]?.region);

  useEffect(() => {
    selectedRegion !== undefined && triggerDistrict(selectedRegion);
  }, [selectedRegion, triggerDistrict]);
  return (
    <>
      <Divider my={'sm'} />
      <Box mih={'80vh'} className="w-full">
        <Group
          className="ml-auto"
          onClick={() =>
            setDeliverDays((prev) => [
              ...prev,
              { quantity: '', location: '', deliverDays: '' },
            ])
          }
        >
          <Button className="ml-auto">
            <IconCirclePlus size={24} />
            Add Delivery
          </Button>
        </Group>
        <Stack className="w-full ml-2 min">
          {/* <Flex gap={'xl'} mih={'40vh'}> */}
          {deliverDays?.map((deliv, index) => {
            return (
              <>
                {/* <Box className="w-full" key={index}> */}
                <Flex gap={'lg'}>
                  <Box key={index} className="grid grid-cols-2 gap-3 w-5/6">
                    <Controller
                      name="region"
                      control={control}
                      render={() => (
                        <Select
                          defaultValue="MW"
                          required
                          label={'Region'}
                          value={selectedRegion}
                          onChange={(value) => setSelectedRegion(value)}
                          error={
                            (selectedRegion === null ||
                              selectedRegion === '') &&
                            'This field is required'
                          }
                          data={
                            regions?.items?.map((item) => ({
                              label: item.name,
                              value: item.id,
                            })) || []
                          }
                          maxDropdownHeight={400}
                        />
                      )}
                    />
                    <Controller
                      name="district"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          defaultValue="MW"
                          required
                          label={'District'}
                          value={value}
                          onChange={onChange}
                          data={
                            districts?.items?.map((item) => ({
                              label: item.name,
                              value: item.id,
                            })) || []
                          }
                          error={errors.district?.message?.toString() ?? ''}
                          maxDropdownHeight={400}
                        />
                      )}
                    />
                    <Controller
                      name={'deliverDays'}
                      control={control}
                      render={({ field: { name, value, onChange } }) => (
                        <NumberInput
                          label={'Delivery Days'}
                          withAsterisk
                          value={value}
                          onChange={onChange}
                          error={errors?.deliverDays?.message?.toString() ?? ''}
                        />
                      )}
                    />
                    <Controller
                      name={'quantity'}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <NumberInput
                          label={'Quantity'}
                          value={value}
                          onChange={onChange}
                          error={errors?.quantity?.message?.toString() ?? ''}
                        />
                      )}
                    />
                  </Box>
                  <Flex justify={'center'} align={'center'} className="">
                    <IconMinus />
                  </Flex>
                </Flex>
                <Divider my={'md'} />
                {/* </Box> */}
              </>
            );
          })}

          {deliverDays.length > 0 && (
            <Group className="ml-auto">
              <>
                {' '}
                <Button onClick={handleSubmit(onCreate)}>Update</Button>
                <Button color="red" onClick={OnDelete}>
                  Delete
                </Button>
              </>
            </Group>
          )}
        </Stack>
      </Box>
    </>
  );
};
