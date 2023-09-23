'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  Button,
  Divider,
  Table,
  Textarea,
  TextInput,
} from '@mantine/core';
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
  useLazyGetOrganizationByIdQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useLazyGetOrganizationsQuery,
} from '@/store/api/organization/organization.api';

import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type PasswordForm = {
  password: string;
  confirmPassword: string;
};

/* Component props type */

/* Component definition */
const ResetPassword = () => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  /* Hooks */

  const resetPassSchema: ZodType<PasswordForm> = z
    .object({
      password: z.string(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'], // path of error
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(resetPassSchema),
  });

  /* Component states */

  const [
    trigger,
    { data: organization, isSuccess: isFetchedOrganizationSuccess },
  ] = useLazyGetOrganizationByIdQuery();

  const [
    createResetPassword,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddOrganizationMutation();

  const handleReset = async (data: any) => {
    const DataSent = {
      ...data,
      email: organization?.code,
    };

    try {
      const response = await createResetPassword(DataSent).unwrap();
      notify('success', 'organization created successfully');
      await router.push(`/organization/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating organization');
    }
  };

  /* Event handlers */
  const onSubmit = async (data: any) => {
    handleReset(data);
  };

  useEffect(() => {
    trigger(id?.toString());
  }, [id, trigger]);

  // /*  */

  return (
    <>
      <Card className="ml-2">
        <Card.Section></Card.Section>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="my-4">
            <TextInput
              placeholder={'Password'}
              label="Password"
              type="passWord"
              error={
                errors?.password ? errors?.password?.message?.toString() : ''
              }
              required
              {...register('password')}
            />
          </div>

          <Divider className="mt-4" />

          <div className="my-4">
            <TextInput
              placeholder={'Confirm Password'}
              label="Confirm Password"
              type="passWord"
              error={
                errors?.confirmPassword
                  ? errors?.confirmPassword?.message?.toString()
                  : ''
              }
              required
              {...register('confirmPassword')}
            />
          </div>

          <Divider className="mt-4 " />

          <div className="mt-4 ">
            <Button type="submit" size="xs">
              <Icon.IconDeviceFloppy size={18} />
              Save
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default ResetPassword;
