'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, Flex, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Select, Card } from '@mantine/core';
import { useSetAddressMutation } from '../_api/adress.api';
import { OrganizationProfile } from '@/models/organization-profile';
import { EntityButton } from '@megp/entity';
import countryCodes from './country-codes.json';
import { useState } from 'react';

/* Component definition */
const OrganizationAdressForm = () => {
  /* Hooks */

  const [create, { isLoading: isSaving }] = useSetAddressMutation();

  const organizationAddressSchema: ZodType<Partial<OrganizationProfile>> =
    z.object({
      region: z.string(),
      zoneOrSubCity: z.string(),
      city: z.string(),
      telephone: z.object({
        countryCode: z.string().default('+251').optional(),
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
              path: ['number'],
            },
          )
          .optional(),
      }),
      fax: z.object({
        countryCode: z.string().default('+251'),
        number: z.string().refine(
          (value) => {
            if (value === '') {
              return true;
            }
            return /^\d{9,12}$/.test(value);
          },
          {
            message: 'Please enter a valid telephone number',
          },
        ),
      }),
      postalCode: z.string(),
      email: z.string(),
      houseNumber: z.string(),
      mobileNumber: z.object({
        countryCode: z.string().default('+251').optional(),
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
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<OrganizationProfile>({
    resolver: zodResolver(organizationAddressSchema),
  });

  const onCreate = async (data) => {
    try {
      await create({ ...data, id: '099454a9-bf8f-45f5-9a4f-6e9034230250' });

      notifications.show({
        message: ' created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'errors in creating .',
        title: 'Error',
        color: 'red',
      });
    }
  };

  return (
    <Stack>
      <TextInput label="Region" {...register('region')} />
      <TextInput label="Zone/Subcity" {...register('zoneOrSubCity')} />

      <TextInput
        label="City"
        error={errors?.city ? errors?.city?.message : ''}
        {...register('city')}
      />

      <TextInput
        label="House number"
        error={errors?.houseNumber ? errors.houseNumber.message : ''}
        {...register('houseNumber')}
      />

      <TextInput
        label="Postal code"
        error={errors?.postalCode ? errors.postalCode?.message : ''}
        {...register('postalCode')}
      />
      <TextInput
        label="Email"
        error={errors?.email ? errors.email.message : ''}
        {...register('email')}
      />
      <div className="mb-2 flex items-center">
        <span>Mobile number</span>
      </div>
      <Flex>
        <Controller
          name="mobileNumber.countyCode"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              defaultValue="+251"
              data={countryCodes.map((item) => ({
                label: `${item.name} (${item.code})`,
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
      <Flex>
        <Controller
          name="telephone.countyCode"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              defaultValue="+251"
              data={countryCodes.map((item) => ({
                label: `${item.name} (${item.code})`,
                value: item.code,
              }))}
              maxDropdownHeight={400}
            />
          )}
        />
        <TextInput className="mb-2 grow" {...register('telephone.number')} />
      </Flex>
      <Flex>
        <Controller
          name="fax.countyCode"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              defaultValue="+251"
              data={countryCodes.map((item) => ({
                label: `${item.name} (${item.code})`,
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
        mode={'new'}
        onCreate={handleSubmit(onCreate)}
        isSaving={isSaving}
      />

      <Divider className="mt-4" />
    </Stack>
  );
};

export default OrganizationAdressForm;
