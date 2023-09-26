'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Textarea, TextInput } from '@mantine/core';

import DeleteConfirmationModal from '@/shared/confirmation';

import * as Icon from '@tabler/icons-react';
import Style from './organizationDetailForm.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Select, Card } from '@mantine/core';
import {
  useAddOrganizationTypeMutation,
  useUpdateOrganizationTypeMutation,
  useLazyGetOrganizationTypeByIdQuery,
  useLazyGetOrganizationTypeQuery,
  useDeleteOrganizationTypeMutation,
} from '@/store/api/orgType/orgType.api';
import { notifications } from '@mantine/notifications';

/* Form schema */

type orgType = {
  name: string;
  description: string;
};

/* Component props type */
type OrgTypeDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const OrgTypeDetailForm = (props: OrgTypeDetailFormProps) => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  /* Hooks */

  const orgSchema: ZodType<orgType> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),

    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<orgType>({ resolver: zodResolver(orgSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [
    trigger,
    { data: orgType, isLoading: isorgTypeLoading, isSuccess: isorgTypeSuccess },
  ] = useLazyGetOrganizationTypeByIdQuery();
  const [
    triggerorgTypes,
    {
      data: orgTypes,
      isLoading: isorgTypesLoading,
      isSuccess: isorgTypesSuccess,
    },
  ] = useLazyGetOrganizationTypeQuery();

  const [
    createorgType,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddOrganizationTypeMutation();
  const [
    updateorgType,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateOrganizationTypeMutation();

  const [
    deleteorgType,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteOrganizationTypeMutation();

  const handleCreate = async (data: any) => {
    try {
      const response = await createorgType(data).unwrap();
      notifications.show({
        message: 'orgType created successfully.',
        title: 'Sucess',
        color: 'green',
      });

      await router.push(`/organization-type/detail/${response.id}`);
    } catch (err) {
      notifications.show({
        message: 'errors in creating orgType.',
        title: 'Sucess',
        color: 'green',
      });
    }
  };

  const handleUpdate = async (data: any) => {
    console.log({ ...data, id: id?.toString() });
    try {
      await updateorgType({ ...data, id: id?.toString() });
      notifications.show({
        message: 'orgType updating successfully',
        title: 'Sucess',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'errors in creating orgType.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const submitDelete = async () => {
    try {
      await deleteorgType(id?.toString()).unwrap();
      notifications.show({
        message: 'orgType deleting successfully',
        title: 'Sucess',
        color: 'green',
      });
      router.push('/organization-type');
    } catch (err) {
      notifications.show({
        message: 'errors in deleting orgType.',
        title: 'Error',
        color: 'red',
      });
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
    props?.mode === 'new' ? handleCreate(data) : handleUpdate(data);
  };

  useEffect(() => {
    if (props.mode == 'update') {
      trigger(id?.toString());
    }
  }, [id, props.mode, trigger]);
  useEffect(() => {
    if (props.mode) {
      triggerorgTypes(true);
    }
  }, [id, props.mode, trigger, triggerorgTypes]);

  useEffect(() => {
    if (props.mode === 'update' && isorgTypeSuccess && orgType !== undefined) {
      reset({
        name: orgType?.name,

        description: orgType?.description,
      });
    }
  }, [isorgTypeSuccess, props.mode, reset, orgType]);
  /*  */

  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Divider className="mt-4" />

        <div className="my-4">
          <TextInput
            className={Style.input}
            placeholder={'Name'}
            label="Name"
            error={errors?.name ? errors?.name?.message?.toString() : ''}
            required
            {...register('name')}
          />
        </div>

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className={Style.input}
            placeholder={'Description'}
            label="Description"
            error={
              errors?.description
                ? errors?.description?.message?.toString()
                : ''
            }
            required
            {...register('description')}
          />
        </div>

        <Divider className="mt-4" />

        {props.mode == 'new' && (
          <Button type="submit" className="mt-4" size="xs">
            <Icon.IconDeviceFloppy size={18} />
            Save
          </Button>
        )}

        {props.mode == 'update' && (
          <div className={Style.flexdisplay}>
            <>
              <Button
                type="submit"
                className={Style.buttonprimary}
                size="xs"
                leftIcon={
                  <Icon.IconDeviceFloppy
                    size={18}
                    className="active-icon mr-1"
                  />
                }
              >
                Update
              </Button>

              <Button
                type="button"
                color="red"
                className={Style.buttonprimary}
                component="button"
                onClick={showDeleteModal}
                size="xs"
              >
                <Icon.IconTrash size="18" className="mr-1" />
                Delete
              </Button>
            </>
          </div>
        )}
      </form>
      <DeleteConfirmationModal
        isModalOpened={displayConfirmationModal}
        confirmModal={submitDelete}
        isModalClosed={hideConfirmationModal}
        id={id?.toString()}
        isConfirmLoading={isDeleting}
        modalTitle={'Delete orgType'}
        confirm_message={'Are you Sure to Delete This Item ?'}
      />
    </Card>
  );
};

export default OrgTypeDetailForm;
