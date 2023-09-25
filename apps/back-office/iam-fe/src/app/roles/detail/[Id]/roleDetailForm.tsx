'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Textarea, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import DeleteConfirmationModal from '@/shared/confirmation';

import * as Icon from '@tabler/icons-react';
import Style from './organizationDetailForm.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Select, Card } from '@mantine/core';
import {
  useLazyGetrolesQuery,
  useGetrolesQuery,
  useGetroleByIdQuery,
  useLazyGetroleByIdQuery,
  useAddroleMutation,
  useUpdateroleMutation,
  useDeleteroleMutation,
} from '@/store/api/role/role.api';

import { notify } from '@/shared/ui/page';

/* Form schema */

type Role = {
  name: string;
  key?: string;
  description: string;
};

/* Component props type */
type RoleDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const RoleDetailForm = (props: RoleDetailFormProps) => {
  /* Router hooks */
  const router = useRouter();

  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  /* Hooks */

  const roleSchema: ZodType<Role> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    key: z.string().optional(),
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
  } = useForm<Role>({ resolver: zodResolver(roleSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [
    trigger,
    {
      data: role,
      isLoading: isFetchedRoleLoading,
      isSuccess: isFetchedRoleSuccess,
    },
  ] = useLazyGetroleByIdQuery();

  const [
    createRole,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddroleMutation();
  const [
    updateRole,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateroleMutation();
  const [
    deleteRole,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteroleMutation();

  const handleCreate = async (data: any) => {
    const dataSent = {
      ...data,
      organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      isSystemRole: false,
    };

    try {
      const response = await createRole(dataSent).unwrap();
      notify('success', 'role created successfully');
      await router.push(`/roles/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating role');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateRole({
        ...data,
        id: id?.toString(),
        isSystemRole: false,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      notify('success', 'role updating successfully');
    } catch (err) {
      notify('error', 'errors in updating role');
    }
  };
  const submitDelete = async () => {
    try {
      await deleteRole(id?.toString()).unwrap();
      notify('success', 'role Deleting successfully');
      router.push('/roles');
    } catch (err) {
      notify('success', 'errors in  deleting  role');
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
    if (props.mode === 'update' && isFetchedRoleSuccess && role !== undefined) {
      reset({
        name: role?.name,
        key: role?.key,
        description: role?.description,
      });
    }
  }, [role, props.mode, reset, isFetchedRoleSuccess]);
  /*  */

  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-4">
          <TextInput
            placeholder={'Name'}
            label="Name"
            error={errors?.name ? errors?.name?.message?.toString() : ''}
            required
            disabled={role?.isSystemRole ? true : false}
            {...register('name')}
          />
        </div>

        <Divider className="mt-4" />

        <div className="my-4">
          <TextInput
            placeholder={'description'}
            label="Description"
            error={
              errors?.description
                ? errors?.description?.message?.toString()
                : ''
            }
            required
            disabled={role?.isSystemRole ? true : false}
            {...register('description')}
          />
        </div>

        <Divider className="mt-4" />

        <div className="my-4">
          <TextInput
            label={'Key'}
            placeholder={'key'}
            disabled={role?.isSystemRole ? true : false}
            error={errors?.key ? errors?.key?.message?.toString() : ''}
            {...register('key')}
          />
          {errors?.key && <span>{errors?.key?.message?.toString()}</span>}
        </div>

        <Divider className="mt-4 " />

        {props.mode == 'new' && (
          <div className="mt-4 ">
            <Button type="submit" size="xs">
              <Icon.IconDeviceFloppy size={18} />
              Save
            </Button>
          </div>
        )}

        {props.mode == 'update' && !role?.isSystemRole && (
          <div className={Style.flexdisplay}>
            <>
              <Button
                type="submit"
                size="xs"
                className={Style.buttonprimary}
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
        modalTitle={'Delete role'}
        confirm_message={'Are you Sure to Delete This Item ?'}
      />
    </Card>
  );
};

export default RoleDetailForm;
