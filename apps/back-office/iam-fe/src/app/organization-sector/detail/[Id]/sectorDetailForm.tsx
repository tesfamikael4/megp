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
  useAddOrganizationSectorMutation,
  useUpdateOrganizationSectorMutation,
  useLazyGetOrganizationSectorByIdQuery,
  useLazyGetOrganizationSectorsQuery,
  useDeleteOrganizationSectorMutation,
} from '@/store/api/orgSector/orgSector.api';
import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type orgSector = {
  name: string;
  description: string;
};

/* Component props Sector */
type OrgSectorDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const OrgSectorDetailForm = (props: OrgSectorDetailFormProps) => {
  /* Router hooks */

  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  /* Hooks */

  const orgSchema: ZodType<orgSector> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),

    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<orgSector>({ resolver: zodResolver(orgSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [
    trigger,
    {
      data: orgSector,
      isLoading: isorgSectorLoading,
      isSuccess: isorgSectorSuccess,
    },
  ] = useLazyGetOrganizationSectorByIdQuery();
  const [
    triggerorgSectors,
    {
      data: orgSectors,
      isLoading: isorgSectorsLoading,
      isSuccess: isorgSectorsSuccess,
    },
  ] = useLazyGetOrganizationSectorsQuery();

  const [
    createorgSector,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddOrganizationSectorMutation();
  const [
    updateorgSector,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateOrganizationSectorMutation();

  const [
    deleteorgSector,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteOrganizationSectorMutation();

  const handleCreate = async (data: any) => {
    try {
      const response = await createorgSector(data).unwrap();
      notify('success', 'orgSector created successfully');

      await router.push(`/organization-sector/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating orgSector');
    }
  };

  const handleUpdate = async (data: any) => {
    console.log({ ...data, id: id?.toString() });
    try {
      await updateorgSector({ ...data, id: id?.toString() });
      notify('success', 'orgSector updating successfully');
    } catch (err) {
      notify('error', 'orgSector updating successfully');
    }
  };
  const submitDelete = async () => {
    try {
      await deleteorgSector(id?.toString()).unwrap();

      router.push('/organization-sector');
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
    if (props.mode) {
      triggerorgSectors(true);
    }
  }, [id, props.mode, trigger, triggerorgSectors]);

  useEffect(() => {
    if (
      props.mode === 'update' &&
      isorgSectorSuccess &&
      orgSector !== undefined
    ) {
      reset({
        name: orgSector?.name,

        description: orgSector?.description,
      });
    }
  }, [isorgSectorSuccess, props.mode, reset, orgSector]);
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
          <Button type="submit" className="mt-4" size="xs" loading={isCreating}>
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
                loading={isUpdating}
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
                loading={isDeleting}
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
        modalTitle={'Delete orgSector'}
        confirm_message={'Are you Sure to Delete This Item ?'}
      />
    </Card>
  );
};

export default OrgSectorDetailForm;
