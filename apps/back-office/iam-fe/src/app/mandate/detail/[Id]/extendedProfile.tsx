'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  Button,
  Card,
  Divider,
  Textarea,
  TextInput,
} from '@mantine/core';

import * as Icon from '@tabler/icons-react';
import Style from './organizationDetailForm.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import {
  useLazyGetOrganizationByIdQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from '@/store/api/organization/organization.api';

import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type OrganizationAdress = {
  publicBody: string;
  address: string;
  pobox: string;
  city: string;
  email: string;
  streetAddress: string;
};

/* Component props type */

/* Component definition */
const ExtendedProfile = () => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  /* Hooks */

  const organizationAddressSchema: ZodType<OrganizationAdress> = z.object({
    publicBody: z.string(),
    address: z.string(),
    pobox: z.string(),
    city: z.string(),
    email: z.string(),
    streetAddress: z.string(),
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

  const handleCreate = async (data: any) => {
    const DataSent = {
      name: data.name,
      organizationType: data.organizationType,
      organizationSector: data.organizationSector,
      shortName: data.shortName,
      description: data.description,
    };
    try {
      const response = await createOrganization(DataSent).unwrap();
      notify('success', 'organization created successfully');
      await router.push(`/organization/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating organization');
    }
  };

  const handleUpdate = async (data: any) => {
    console.log({ ...data, id: id?.toString() });
    try {
      await updateOrganization({ ...data, id: id?.toString() });
      notify('success', 'organization updating successfully');
    } catch (err) {
      notify('error', 'errors in updating organization');
    }
  };
  const submitDelete = async () => {
    try {
      await deleteOrganization(id?.toString()).unwrap();

      router.push('/organization');
    } catch (err) {
      console.log(err);
    }
    setDisplayConfirmationModal(false);
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
    'new' ? handleCreate(data) : handleUpdate(data);
  };

  useEffect(() => {
    trigger(id?.toString());
  }, [id, trigger]);

  // useEffect(() => {
  //   if (

  //     isFetchedOrganizationSuccess &&
  //     organization !== undefined
  //   ) {
  //     reset({
  //       name: organization?.name,
  //       code: organization?.code,
  //       organizationType: organization?.organizationType,
  //     });
  //   }
  // }, [isFetchedOrganizationSuccess, organization,  reset]);
  // /*  */

  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Divider className="mt-4" />

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="Public Body"
            {...register('publicBody')}
          />
        </div>

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="Address"
            {...register('address')}
          />
        </div>

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="P.O. Box:1234"
            {...register('pobox')}
          />
        </div>

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput className="mb-2" label="Town/City" {...register('city')} />
        </div>

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="E-mail address"
            {...register('email')}
          />
        </div>

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className="mb-2"
            label="Street Address"
            {...register('streetAddress')}
          />
        </div>

        <Button
          color={'red'}
          type="button"
          className="my-4 bg-red-600 hover:bg-red-800 "
          leftIcon={<Icon.IconLock size={18} />}
          size="xs"
        >
          save
        </Button>
      </form>
    </Card>
  );
};

export default ExtendedProfile;
