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
  useLazyGetMandateByIdQuery,
  useLazyGetMandateQuery,
} from '@/store/api/role/role.api';

import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type Organization = {
  name: string;

  key?: string;
  isSingleAssignment: string;

  description: string;
};

/* Component props type */
type OrganizationDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const OrganizationDetailForm = (props: OrganizationDetailFormProps) => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  /* Hooks */

  const organizationSchema: ZodType<Organization> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    key: z.string().optional(),
    isSingleAssignment: z.string(),
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

  const [
    trigger,
    {
      data: organization,
      isLoading: isFetchedOrganizationLoading,
      isSuccess: isFetchedOrganizationSuccess,
    },
  ] = useLazyGetMandateByIdQuery();

  useEffect(() => {
    if (props.mode == 'update') {
      trigger(id?.toString());
    }
  }, [id, props.mode, trigger]);

  useEffect(() => {
    if (isFetchedOrganizationSuccess && organization !== undefined) {
      reset({
        name: organization?.name,
        key: organization?.key,
        description: organization?.description,
        isSingleAssignment:
          organization?.isSingleAssignment === true ? 'Yes' : 'No',
      });
    }
  }, [isFetchedOrganizationSuccess, organization, reset]);
  /*  */

  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>
      <form>
        <div className="my-4">
          <TextInput
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
            placeholder={'description'}
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

        <div className="my-4">
          <Controller
            name="isSingleAssignment"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Organization Type"
                value={value}
                required
                onChange={onChange}
                data={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' },
                ]}
              />
            )}
          />
        </div>

        <Divider className="mt-4" />

        <div className="my-4">
          <TextInput
            label={'Key'}
            placeholder={'key'}
            error={errors?.key ? errors?.key?.message?.toString() : ''}
            {...register('key')}
          />
          {errors?.key && <span>{errors?.key?.message?.toString()}</span>}
        </div>
        <Divider className="mt-4 " />
      </form>
    </Card>
  );
};

export default OrganizationDetailForm;
