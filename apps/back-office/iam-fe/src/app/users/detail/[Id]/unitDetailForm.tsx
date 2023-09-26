'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Textarea, TextInput, Text } from '@mantine/core';

import DeleteConfirmationModal from '@/shared/confirmation';

import * as Icon from '@tabler/icons-react';
import Style from './organizationDetailForm.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Card } from '@mantine/core';
import {
  useAddNewUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useLazyGetUserByIdQuery,
  useLazyGetUsersQuery,
  useUserActivationMutation,
} from '@/store/api/user/user.api';
import { useLazyGetUnitTypeQuery } from '@/store/api/unitType/unitType.api';
import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type User = {
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
};

/* Component props type */
type UnitDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const UserDetailForm = (props: UnitDetailFormProps) => {
  /* Router hooks */

  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  /* Hooks */

  const userSchema: ZodType<User> = z.object({
    firstName: z.string().min(1, { message: 'Firstname is required' }),
    username: z.string().min(1, { message: 'User Name is required' }),
    lastName: z.string().min(1, { message: 'Lastname is required' }),
    email: z
      .string()
      .email({ message: 'Must be a valid email' })
      .optional()
      .or(z.literal('')),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<User>({ resolver: zodResolver(userSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [
    trigger,
    { data: user, isLoading: isUnitLoading, isSuccess: isUnitSuccess },
  ] = useLazyGetUserByIdQuery();
  const [
    triggerUnits,
    { data: users, isLoading: isUnitsLoading, isSuccess: isUnitsSuccess },
  ] = useLazyGetUsersQuery();

  const [
    createUser,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddNewUserMutation();
  const [
    updateUser,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateUserMutation();

  const [activateUser, { isLoading: isActivation, isSuccess: isActivated }] =
    useUserActivationMutation();

  const [
    deleteUser,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteUserMutation();

  const handleCreate = async (data: any) => {
    try {
      const response = await createUser({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      }).unwrap();
      notify('success', 'user created successfully');

      await router.push(`/users/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating unit');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateUser({
        ...data,
        id: id?.toString(),

        fullName: `${data.firstName} ${data.lastName}`,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      notify('success', 'User updating successfully');
    } catch (err) {
      notify('error', 'User updating successfully');
    }
  };
  const submitDelete = async () => {
    try {
      await deleteUser(id?.toString()).unwrap();
      notify('success', 'User deleted successfully');
      router.push('/users');
    } catch (err) {
      notify('success', 'User not deleted successfully');
    }
    setDisplayConfirmationModal(false);
  };
  const handleActive = async (data) => {
    try {
      await activateUser(id?.toString());
      notify('success', 'User updating successfully');
    } catch (err) {
      notify('error', 'User updating successfully');
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
    props?.mode === 'new' ? handleCreate(data) : handleUpdate(data);
  };

  useEffect(() => {
    if (props.mode == 'update') {
      trigger(id?.toString());
    }
  }, [id, props.mode, trigger]);
  useEffect(() => {
    if (props.mode) {
      triggerUnits(true);
    }
  }, [id, props.mode, trigger, triggerUnits]);

  useEffect(() => {
    if (props.mode === 'update' && isUnitSuccess && user !== undefined) {
      reset({
        firstName: user?.firstName,
        lastName: user?.lastName,
        username: user?.username,
        email: user?.email,
      });
    }
  }, [isUnitSuccess, props.mode, reset, user]);
  /*  */
  console.log(user);
  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {props.mode == 'update' && (
          <>
            <div className="flex row items-center mt-2 mb-2">
              <Icon.IconUser></Icon.IconUser>
              <Text fw={700}>{`Account: ${user?.username}`}</Text>
            </div>{' '}
            <Divider h={25} />
          </>
        )}

        <div className="flex justify-between w-full gap-3 ">
          <div className="w-full">
            <TextInput
              className={Style.input}
              placeholder={'First Name'}
              label="Name"
              error={
                errors?.firstName ? errors?.firstName?.message?.toString() : ''
              }
              required
              {...register('firstName')}
            />
          </div>
          <div className="w-full">
            <TextInput
              className={Style.input}
              placeholder={'Last Name'}
              label="Last Name"
              error={
                errors?.firstName ? errors?.firstName?.message?.toString() : ''
              }
              required
              {...register('lastName')}
            />
          </div>
        </div>
        <Divider my="sm" />
        <div className="my-4">
          <TextInput
            className={Style.input}
            placeholder={'User Name'}
            label="User Name"
            error={
              errors?.username ? errors?.username?.message?.toString() : ''
            }
            required
            {...register('username')}
          />
        </div>
        <Divider my="sm" />
        <div className="my-4">
          <TextInput
            className={Style.input}
            placeholder={'Email'}
            label="Email"
            error={errors?.email ? errors?.email?.message?.toString() : ''}
            required
            {...register('email')}
          />
        </div>

        {props.mode == 'new' && (
          <Button
            type="submit"
            className={Style.button}
            size="xs"
            loading={isCreatedSuccessfully}
          >
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
                className={Style.buttonprimary}
                size="xs"
                color={user?.isActive ? 'red' : ''}
                onClick={handleActive}
                leftIcon={
                  <Icon.IconDeviceFloppy
                    size={18}
                    className="active-icon mr-1"
                  />
                }
              >
                {user?.isActive ? 'Deactivate' : 'Activate'}
              </Button>

              {/* <Button
                className="btn"
                variant="filled"
                style={{
                  backgroundColor: unit?.isActive ? 'red' : 'gray',
                }}
                onClick={handleActive}
                size="xs"
                type="button"
                loading={isUpdating}
              >
                {unit?.isActive ? 'Deactivate' : 'Activate'}
              </Button> */}

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
        modalTitle={'Delete Unit'}
        confirm_message={'Are you Sure to Delete This Item ?'}
      />
    </Card>
  );
};

export default UserDetailForm;
