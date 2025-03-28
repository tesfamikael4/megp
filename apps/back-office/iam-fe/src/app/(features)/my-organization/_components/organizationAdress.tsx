'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Divider,
  Flex,
  Stack,
  TextInput,
  Text,
  LoadingOverlay,
  Group,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Select } from '@mantine/core';
import { useSetAddressMutation } from '@/app/(features)/my-organization/_api/adress.api';
import { OrganizationProfile } from '@/models/organization-profile';
import { EntityButton } from '@megp/entity';
import countryCodes from './country-codes.json';
import { useEffect, useState } from 'react';
import { useReadQuery } from '../_api/adress.api';
import { logger, notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';
import {
  useGetRegionsQuery,
  useLazyGetDistrictsQuery,
} from '@/store/api/administration/administration.api';

type ModeType = 'new' | 'detail';

const defaultValues = {
  region: '',
  selectedRegion: '',
  district: '',
  telephone: {
    countryCode: '',
    number: '',
  },
  fax: {
    countryCode: '',
    number: '',
  },
  postalCode: '',
  email: '',
};
/* Component definition */
const OrganizationAdressForm = () => {
  const organizationAddressSchema: ZodType<Partial<OrganizationProfile>> =
    z.object({
      district: z.string({
        required_error: 'This field is required',
        invalid_type_error: 'This field is required',
      }),
      telephone: z.object({
        countryCode: z.string().default('MW').optional(),
        number: z
          .string()
          .default('')
          .refine(
            (value) => {
              if (value === '') {
                return true;
              }

              return /^\d{9,12}$/.test(value);
            },
            {
              message: 'Please enter a valid telephone number',
            },
          )
          .optional(),
      }),
      fax: z.object({
        countryCode: z.string().default('MW'),
        number: z.string().refine(
          (value) => {
            if (value === '') {
              return true;
            }
            return /^\d{9,12}$/.test(value);
          },
          {
            message: 'Please enter a valid fax number',
          },
        ),
      }),
      postalCode: z.string(),
      email: z
        .string()
        .email({ message: 'Must be a valid email' })
        .optional()
        .nullable()
        .or(z.literal('')),
    });

  const [mode, setMode] = useState<ModeType>('new');
  const { organizationId } = useAuth();

  const [selectedRegion, setSelectedRegion] = useState<any>();

  const [create, { isLoading: isSaving }] = useSetAddressMutation();
  const [update, { isLoading: isUpdating }] = useSetAddressMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(organizationId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<OrganizationProfile>({
    resolver: zodResolver(organizationAddressSchema),
  });

  const { data: regions } = useGetRegionsQuery(undefined);
  const [triggerDistrict, { data: districts }] = useLazyGetDistrictsQuery();

  useEffect(() => {
    selectedRegion !== undefined && triggerDistrict(selectedRegion);
  }, [selectedRegion, triggerDistrict]);

  const onCreate = async (data) => {
    const dataSent = {
      id: organizationId,
      address: {
        ...data,
        region: selectedRegion,
      },
    };

    try {
      await create(dataSent).unwrap();
      notify('Success', 'Organization address created successfully');
    } catch (err) {
      notify('Error', 'Errors in creating organization address');
    }
  };

  const onUpdate = async (data) => {
    const dataSent = {
      id: organizationId,
      address: {
        ...data,
        region: selectedRegion,
      },
    };

    try {
      await update(dataSent).unwrap();
      notify('Success', 'Organization address updated successfully');
    } catch (err) {
      notify('Error', 'Errors in creating organization address');
    }
  };

  const onErr = (err) => {
    logger.log(err);
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode === 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        zoneOrSubCity: selected?.address?.zoneOrSubCity,
        city: selected?.address?.city,
        telephone: selected?.address?.telephone,
        fax: selected?.address?.fax,
        postalCode: selected?.address?.postalCode,
        email: selected?.address?.email,
        houseNumber: selected?.address?.houseNumber,
        district: selected?.address?.district,
      });
      setSelectedRegion(selected?.address?.region);
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    if (selectedSuccess) {
      selected.address !== null && setMode('detail');
    }
  }, [selected?.address, selectedSuccess]);

  return (
    <Stack pos={'relative'}>
      <LoadingOverlay visible={isLoading} />
      <Group grow>
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
                (selectedRegion === null || selectedRegion === '') &&
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
              error={errors?.district ? errors.district?.message : ''}
              maxDropdownHeight={400}
            />
          )}
        />
      </Group>

      <Group grow>
        <TextInput
          label="Email"
          error={errors?.email ? errors.email.message : ''}
          {...register('email')}
        />
        <TextInput
          label="Postal Code"
          error={errors?.postalCode ? errors.postalCode?.message : ''}
          {...register('postalCode')}
        />
      </Group>
      <Group grow>
        <Flex direction={'column'}>
          <Text fw={500}>Telephone Number</Text>

          <Flex>
            <Controller
              name="telephone.countyCode"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  className="w-1/3"
                  defaultValue="MW"
                  value={value}
                  onChange={onChange}
                  data={countryCodes.map((item) => ({
                    label: `${item.name} (${item.dial_code})`,
                    value: item.code,
                  }))}
                  maxDropdownHeight={400}
                />
              )}
            />
            <TextInput
              className="mb-2 grow"
              {...register('telephone.number')}
              error={
                errors?.telephone?.number
                  ? errors.telephone?.number.message
                  : ''
              }
            />
          </Flex>
        </Flex>
        <Flex direction={'column'}>
          <Text fw={500}>Fax Number</Text>

          <Flex>
            <Controller
              name="fax.countyCode"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-1/3"
                  {...field}
                  defaultValue="MW"
                  data={countryCodes.map((item) => ({
                    label: `${item.name} (${item.dial_code})`,
                    value: item.code,
                  }))}
                  maxDropdownHeight={400}
                />
              )}
            />
            <TextInput
              className="mb-2 grow"
              error={errors?.fax?.number ? errors.fax?.number.message : ''}
              {...register('fax.number')}
            />
          </Flex>
        </Flex>
      </Group>

      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate, onErr)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />

      <Divider className="mt-4" />
    </Stack>
  );
};

export default OrganizationAdressForm;
