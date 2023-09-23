'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Textarea, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import DeleteConfirmationModal from '@/shared/confirmation';

import * as Icon from '@tabler/icons-react';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Select, Card } from '@mantine/core';
import {
  useLazyGetOrganizationByIdQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from '@/store/api/organization/organization.api';

import { notify } from '@/shared/ui/notification/utility/notify';
import { useLazyGetOrganizationTypeQuery } from '@/store/api/lookUps/lookups.api';
import { useLazyGetOrganizationSectorsQuery } from '@/store/api/orgSector/orgSector.api';

/* Form schema */

type Organization = {
  name: string;
  typeId?: string;
  code?: string | null;
  sectorId?: string;
  shortName?: string;
  description: string;
};

/* Component props type */

/* Component definition */
const BasicProfile = () => {
  /* Router hooks */

  /* Hooks */

  const organizationSchema: ZodType<Organization> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    typeId: z.string(),
    code: z.string().optional().nullable(),

    sectorId: z.string(),
    shortName: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
    getValues,
  } = useForm<Organization>({ resolver: zodResolver(organizationSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [triggerOrgType, { data: orgType, isLoading: isTypeLoading }] =
    useLazyGetOrganizationTypeQuery();
  const [triggerOrgSector, { data: orgSector, isLoading: isSectorLoading }] =
    useLazyGetOrganizationSectorsQuery();
  const [
    trigger,
    {
      data: organization,
      isLoading: isFetchedOrganizationLoading,
      isSuccess: isFetchedOrganizationSuccess,
    },
  ] = useLazyGetOrganizationByIdQuery();

  const [
    createOrganization,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddOrganizationMutation();
  const [
    updateOrganization,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateOrganizationMutation();
  const [
    deleteOrganization,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteOrganizationMutation();

  useEffect(() => {
    trigger('099454a9-bf8f-45f5-9a4f-6e9034230250');
  }, [trigger]);

  useEffect(() => {
    if (isFetchedOrganizationSuccess && organization !== undefined) {
      reset({
        name: organization?.name,
        shortName: organization?.shortName,
        description: organization?.description,
        code: organization?.code,
        typeId: organization?.typeId,
        sectorId: organization?.sectorId,
      });
    }
  }, [isFetchedOrganizationSuccess, organization, reset]);
  /*  */
  useEffect(() => {
    triggerOrgType(true);
  }, [triggerOrgType]);

  useEffect(() => {
    triggerOrgSector(true);
  }, [triggerOrgSector]);

  return (
    <Card className="ml-2">
      <Card.Section></Card.Section>
      <form>
        <div className="my-4">
          <TextInput
            placeholder={'Name'}
            label="Name"
            required
            {...register('name')}
          />
        </div>

        <Divider className="mt-4" />

        <div className="my-4">
          <TextInput
            placeholder={'shortName'}
            label="Short name"
            required
            {...register('shortName')}
          />
        </div>

        <Divider className="mt-4" />

        <div className="my-4">
          <TextInput
            placeholder={'description'}
            label="Description"
            required
            {...register('description')}
          />
        </div>

        <Divider className="mt-4" />

        <div className="my-4">
          <Controller
            name="typeId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Organization Type"
                value={value}
                required
                onChange={onChange}
                data={
                  orgType?.items?.map((type) => ({
                    value: type?.id,
                    label: type?.name,
                  })) || []
                }
              />
            )}
          />
        </div>
        <Divider className="mt-4" />

        <div className="my-4">
          <Controller
            name="sectorId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Organization Sector"
                value={value}
                required
                onChange={onChange}
                data={
                  orgSector?.items?.map((type) => ({
                    value: type?.id,
                    label: type?.name,
                  })) || []
                }
              />
            )}
          />
        </div>
        <Divider className="mt-4" />

        <div className="my-4">
          <TextInput
            label={'External Organization Code'}
            placeholder={'Code'}
            disabled
            error={errors?.code ? errors?.code?.message?.toString() : ''}
            {...register('code')}
          />
          {errors?.code && <span>{errors?.code?.message?.toString()}</span>}
        </div>
        <Divider className="mt-4 " />
      </form>
    </Card>
  );
};

export default BasicProfile;
