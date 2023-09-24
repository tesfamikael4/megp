'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, TextInput } from '@mantine/core';
import DeleteConfirmationModal from '@/shared/confirmation';
import * as Icon from '@tabler/icons-react';
import Style from './organizationDetailForm.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Card } from '@mantine/core';
import {
  useLazyGetInvitedOaByIdQuery,
  useLazyGetInvitedOaQuery,
  useUpdateInvitedOaMutation,
  useAddInvitedOaMutation,
} from '@/store/api/organization/organization.api';

import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type Personnel = {
  firstName: string;
  lastName: string;
  email: string;
};

/* Component props type */
type InvitationDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const InviteOaDetailForm = (props: InvitationDetailFormProps) => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  /* Hooks */

  const PersonnelSchema: ZodType<Personnel> = z.object({
    firstName: z.string().min(1, { message: 'This field is required' }),
    lastName: z.string().min(1, { message: 'This field is required' }),
    email: z.string().email().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Personnel>({ resolver: zodResolver(PersonnelSchema) });

  /* Component states */
  const [trigger, { data: personnel, isSuccess: isFetchedPersonnelSuccess }] =
    useLazyGetInvitedOaByIdQuery();

  const [
    createPersonnel,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddInvitedOaMutation();
  const [
    updatePersonnel,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateInvitedOaMutation();

  const handleCreate = async (data: any) => {
    try {
      const response = await createPersonnel(data).unwrap();
      notify('success', 'Personnel created successfully');
      await router.push(`/personnel/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating personnel');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updatePersonnel({ ...data, id: id?.toString() });
      notify('success', 'Personnel updating successfully');
    } catch (err) {
      notify('error', 'errors in updating personnel');
    }
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
    if (
      props.mode === 'update' &&
      isFetchedPersonnelSuccess &&
      personnel !== undefined
    ) {
      reset({
        lastName: personnel?.firstName,
        firstName: personnel?.lastName,
        email: personnel?.email,
      });
    }
  }, [isFetchedPersonnelSuccess, personnel, props.mode, reset]);
  /*  */

  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-4">
          <TextInput
            placeholder={'First Name'}
            label="Full Name"
            error={
              errors?.firstName ? errors?.firstName?.message?.toString() : ''
            }
            required
            {...register('firstName')}
          />
        </div>

        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            placeholder={'Last Name'}
            label="Last Name"
            error={
              errors?.lastName ? errors?.lastName?.message?.toString() : ''
            }
            required
            {...register('lastName')}
          />
        </div>

        <div className="my-4">
          <TextInput
            placeholder={'Email'}
            label="Email"
            error={errors?.email ? errors?.email?.message?.toString() : ''}
            required
            {...register('email')}
          />
        </div>

        <Divider className="mt-4" />

        <Divider className="mt-4 " />
        {props.mode == 'new' && (
          <div className="mt-4 ">
            <Button type="submit" size="xs">
              <Icon.IconDeviceFloppy size={18} />
              Save
            </Button>
          </div>
        )}

        {props.mode == 'update' && (
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
                size="xs"
                className={Style.buttonprimary}
                leftIcon={
                  <Icon.IconToggleLeft size={18} className="active-icon mr-1" />
                }
              >
                Activate
              </Button>
            </>
          </div>
        )}
      </form>
    </Card>
  );
};

export default InviteOaDetailForm;
