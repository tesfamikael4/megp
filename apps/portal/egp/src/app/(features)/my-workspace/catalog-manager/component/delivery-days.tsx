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
  const [deliverDays, setDeliverDays] = useState<any[]>([]);
  const generateSchema = (numEntries: number) => {
    const shape = {};
    for (let i = 0; i < numEntries; i++) {
      shape[`quantity_${i}`] = z.number().optional();
      shape[`deliverDays_${i}`] = z.number();
      shape[`district_${i}`] = z
        .string()
        .min(1, { message: 'This field is required' });
      // shape[`region_${i}`] = z
      //   .string()
      //   .min(1, { message: 'This field is required' });
    }
    return z.object(shape);
  };
  const schema = generateSchema(deliverDays.length);

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

  useEffect(() => {
    selectedRegion !== undefined && triggerDistrict(selectedRegion);
  }, [selectedRegion, triggerDistrict]);

  return (
    <>
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
          {deliverDays?.map((deliv, index) => {
            return (
              <>
                <Flex gap={'lg'}>
                  <Box key={index} className="grid grid-cols-2 gap-3 w-5/6">
                    <Controller
                      name={`region_${index}`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          defaultValue="MW"
                          required
                          label={'Region'}
                          value={value}
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
                      name={`district_${index}`}
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
                      name={`deliverDays_${index}`}
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
                      name={`quantity_${index}`}
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
              </>
            );
          })}

          {deliverDays.length > 0 && (
            <Group className="ml-auto pe-4">
              <>
                {' '}
                <Button>Update</Button>
                <Button color="red">Delete</Button>
              </>
            </Group>
          )}
        </Stack>
      </Box>
    </>
  );
};
