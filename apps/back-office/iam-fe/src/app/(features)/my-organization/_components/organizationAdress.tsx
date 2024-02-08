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
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';

type ModeType = 'new' | 'detail';

const defaultValues = {
  region: '',

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

  mobileNumber: {
    countryCode: '',
    number: '',
  },
};
/* Component definition */
const OrganizationAdressForm = () => {
  const organizationAddressSchema: ZodType<Partial<OrganizationProfile>> =
    z.object({
      region: z.string().min(1, { message: 'Please select region.' }),
      district: z.string().min(1, { message: 'Please select district' }),

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
      email: z.string().email('This is not a valid email.'),

      mobileNumber: z.object({
        countryCode: z.string().default('MW'),
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
              message: 'Please enter a valid mobile number',
            },
          )
          .optional(),
      }),
    });

  const [mode, setMode] = useState<ModeType>('new');
  const { organizationId } = useAuth();

  const [selectedDistrict, setSelectedDistrict] = useState<any>();

  const [create, { isLoading: isSaving }] = useSetAddressMutation();
  const [update, { isLoading: isUpdating }] = useSetAddressMutation();

  const regionOption = ['Southern', 'Northern', 'Central'];

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
    watch,
    reset,
  } = useForm<OrganizationProfile>({
    resolver: zodResolver(organizationAddressSchema),
  });
  const selectedRegion = watch('region');

  useEffect(() => {
    const districtOptions = {
      Southern: [
        'Balaka',
        'Blantyre',
        'Chikwawa',
        'Chiradzulu',
        'Machinga',
        'Mangochi',
        'Mulanje',
        'Mwanza',
        'Neno',
        'Nsanje',
        'Phalombe',
        'Thyolo',
        'Zomba',
      ],
      Northern: [
        'Chitipa ',
        'Karonga',
        'Likoma',
        'Mzimba',
        'Nkhata Bay',
        'Rumphi',
      ],
      Central: [
        'Dedza',
        'Dowa',
        'Kasungu',
        'Lilongwe',
        'Mchinji',
        'Nkhotakota',
        'Ntcheu',
        'Ntchisi',
        'Salima',
      ],
    };
    const updatedOptions =
      districtOptions[selectedRegion]?.map((item) => ({
        label: item,
        value: item,
      })) || [];
    setSelectedDistrict(updatedOptions);
  }, [selectedRegion]);

  const onCreate = async (data) => {
    const dataSent = {
      id: organizationId,
      address: {
        ...data,
      },
    };

    try {
      await create(dataSent);
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
      },
    };

    try {
      await update(dataSent);
      notify('Success', 'Organization address updated successfully');
    } catch (err) {
      notify('Error', 'Errors in creating organization address');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  useEffect(() => {
    if (mode === 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        region: selected?.address?.region,
        zoneOrSubCity: selected?.address?.zoneOrSubCity,
        city: selected?.address?.city,
        telephone: selected?.address?.telephone,
        fax: selected?.address?.fax,
        postalCode: selected?.address?.postalCode,
        email: selected?.address?.email,
        houseNumber: selected?.address?.houseNumber,
        mobileNumber: selected?.address?.mobileNumber,
        district: selected?.address?.district,
      });
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
          render={({ field: { onChange, value } }) => (
            <Select
              defaultValue="MW"
              label={'Region'}
              value={value}
              onChange={onChange}
              data={
                regionOption?.map((item) => ({
                  label: item,
                  value: item,
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
              label={'District'}
              value={value}
              onChange={onChange}
              data={selectedDistrict}
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
          label="Postal code"
          error={errors?.postalCode ? errors.postalCode?.message : ''}
          {...register('postalCode')}
        />
      </Group>

      <Text fw={500}>Mobile Number</Text>

      <Flex>
        <Controller
          name="mobileNumber.countyCode"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              defaultValue={'MW'}
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
          error={
            errors?.mobileNumber?.number
              ? errors.mobileNumber?.number.message
              : ''
          }
          {...register('mobileNumber.number')}
        />
      </Flex>
      <Text fw={500}>Telephone Number</Text>

      <Flex>
        <Controller
          name="telephone.countyCode"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
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
            errors?.telephone?.number ? errors.telephone?.number.message : ''
          }
        />
      </Flex>
      <Text fw={500}>Fax Number</Text>

      <Flex>
        <Controller
          name="fax.countyCode"
          control={control}
          render={({ field }) => (
            <Select
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

      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
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
