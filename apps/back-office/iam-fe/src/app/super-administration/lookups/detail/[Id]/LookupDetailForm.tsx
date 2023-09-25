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
  useGetOrganizationTypeByIdQuery,
  useLazyGetOrganizationTypeByIdQuery,
  useLazyGetOrganizationTypeQuery,
  useGetOrganizationTypeQuery,
  useDeleteOrganizationTypeMutation,
} from '@/store/api/lookUps/lookups.api';
import { notify } from '@/shared/ui/page';

/* Form schema */

type Lookup = {
  name: string;
  description: string;
};

/* Component props type */
type LookupDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const LookupDetailForm = (props: LookupDetailFormProps) => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  /* Hooks */

  const lookupSchema: ZodType<Lookup> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Lookup>({ resolver: zodResolver(lookupSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [
    trigger,
    { data: lookup, isLoading: islookupLoading, isSuccess: islookupSuccess },
  ] = useLazyGetOrganizationTypeByIdQuery();

  const [
    createlookup,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddOrganizationTypeMutation();
  const [
    updateLookup,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateOrganizationTypeMutation();

  const [
    deleteLookup,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteOrganizationTypeMutation();

  const handleCreate = async (data: any) => {
    try {
      const response = await createlookup(data).unwrap();
      notify('success', 'lookup created successfully');

      await router.push(`/lookups/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating lookup');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateLookup({ ...data, id: id?.toString() });
      notify('success', 'lookup updating successfully');
    } catch (err) {
      notify('error', 'lookup updating successfully');
    }
  };
  const submitDelete = async () => {
    try {
      await deleteLookup(id?.toString()).unwrap();

      router.push('/lookups');
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
    props?.mode === 'new' ? handleCreate(data) : handleUpdate(data);
  };

  useEffect(() => {
    if (props.mode == 'update') {
      trigger(id?.toString());
    }
  }, [id, props.mode, trigger]);

  useEffect(() => {
    if (props.mode === 'update' && islookupSuccess && lookup !== undefined) {
      reset({
        name: lookup?.name,
        description: lookup?.description,
      });
    }
  }, [
    islookupSuccess,
    lookup,
    lookup?.code,
    lookup?.description,
    lookup?.name,
    props.mode,
    reset,
  ]);
  /*  */

  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-4"></div>
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
          <Textarea
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

        {props.mode == 'new' && (
          <Button type="submit" className={Style.button} size="xs">
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
        modalTitle={'Delete Unit'}
        confirm_message={'Are you Sure to Delete This Item ?'}
      />
    </Card>
  );
};

export default LookupDetailForm;
