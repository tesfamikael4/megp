'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, Button, Divider, Textarea, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import DeleteConfirmationModal from '@/shared/confirmation';

import * as Icon from '@tabler/icons-react';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import countryCodes from '@/shared/core/utilities/country.json';
import { Select, Card } from '@mantine/core';
import {
  useSetOrganizationAdresseMutation,
  useLazyGetOrganizationsQuery,
  useLazyGetOrganizationByIdQuery,
} from '@/store/api/organization/organization.api';

import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type OrganizationAdress = {
  region: string;
  zoneOrSubCity: string;
  city: string;

  houseNumber: string;
  mobileNumber: {
    countyCode?: string;
    number?: string;
  };
  telephone: {
    countyCode?: string;
    number?: string;
  };
  fax: {
    countyCode?: string;
    number?: string;
  };

  postalCode: string;
  email: string;
};

/* Component props type */

/* Component definition */
const OrganizationAdressForm = () => {
  /* Router hooks */

  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  /* Hooks */

  const organizationAddressSchema: ZodType<OrganizationAdress> = z.object({
    region: z.string(),
    zoneOrSubCity: z.string(),
    city: z.string(),
    telephone: z.object({
      countryCode: z.string().default('+251'),
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
        ),
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
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
    getValues,
  } = useForm<OrganizationAdress>({
    resolver: zodResolver(organizationAddressSchema),
  });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [
    setOrganizationAdress,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useSetOrganizationAdresseMutation();

  const [
    trigger,
    {
      data: organization,
      isLoading: isFetchedOrganizationLoading,
      isSuccess: isFetchedOrganizationSuccess,
    },
  ] = useLazyGetOrganizationByIdQuery();

  const handleUpdate = async (data: any) => {
    const dataSent = {
      address: {
        ...data,
      },
      id: '099454a9-bf8f-45f5-9a4f-6e9034230250',
    };
    console.log(dataSent);
    try {
      await setOrganizationAdress(dataSent);
      notify('success', 'organization updating successfully');
    } catch (err) {
      notify('error', 'errors in updating organization');
    }
  };

  /*Show delete modal when delete button is clicked */
  const showDeleteModal = () => {
    setDisplayConfirmationModal(true);
  };
  // close delete modal after an item is deleted */
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  /* Event handlers */
  const onSubmit = async (data: any) => {
    handleUpdate(data);
  };

  useEffect(() => {
    trigger('099454a9-bf8f-45f5-9a4f-6e9034230250');
  }, [trigger]);

  useEffect(() => {
    if (isFetchedOrganizationSuccess && organization !== undefined) {
      reset({
        region: organization?.address?.region,
        zoneOrSubCity: organization?.address?.zoneOrSubCity,
        city: organization?.address?.city,
        houseNumber: organization?.address?.houseNumber,
        mobileNumber: organization?.address?.mobileNumber,
        telephone: organization?.address?.telephone,
        fax: organization?.address?.fax,
        postalCode: organization?.address?.postalCode,
        email: organization?.address?.email,
      });
    }
  }, [isFetchedOrganizationSuccess, organization, reset]);
  // /*  */

  return (
    <Card className="ml-2">
      <Card.Section></Card.Section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Divider className="mt-4" />

        <div className="my-4">
          <TextInput className="mb-2" label="Region" {...register('region')} />
        </div>
        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="Zone/Subcity"
            {...register('zoneOrSubCity')}
          />
        </div>
        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="City"
            error={errors?.city ? errors?.city?.message : ''}
            {...register('city')}
          />
        </div>
        <Divider className="mt-4" />
        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="House number"
            error={errors?.houseNumber ? errors.houseNumber.message : ''}
            {...register('houseNumber')}
          />
        </div>
        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="Postal code"
            error={errors?.postalCode ? errors.postalCode?.message : ''}
            {...register('postalCode')}
          />
        </div>
        <Divider className="mt-4" />
        <Divider className="mt-4" />
        <div className="my-4">
          <div className="mb-2 flex items-center">
            <span>Mobile number</span>
          </div>
          <div className="flex">
            <Controller
              name="mobileNumber.countyCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="mb-2"
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
          </div>
        </div>
        <Divider className="mt-4" />
        <div className="my-4">
          <div className="mb-2 flex items-center">
            <span>Telephone number</span>
          </div>
          <div className="flex">
            <Controller
              name="telephone.countyCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="mb-2"
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
              {...register('telephone.number')}
            />
          </div>
        </div>
        <Divider className="mt-4" />

        <div className="my-4">
          <div className="mb-2 flex items-center">
            <span>Fax number</span>
          </div>
          <div className="flex">
            <Controller
              name="fax.countyCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="mb-2"
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
          </div>
        </div>

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="Email"
            error={errors?.email ? errors.email.message : ''}
            {...register('email')}
          />
        </div>

        <Button
          type="submit"
          className="my-4 bg-primary"
          leftIcon={<Icon.IconDeviceFloppy size={18} />}
          size="xs"
        >
          {organization?.address?.length !== 0 ? 'update' : 'save '}
        </Button>

        <Divider className="mt-4" />

        <Button
          color={'red'}
          type="button"
          className="my-4 bg-red-600 hover:bg-red-800 "
          leftIcon={<Icon.IconLock size={18} />}
          size="xs"
        >
          Offline
        </Button>
      </form>
    </Card>
  );
};

export default OrganizationAdressForm;
