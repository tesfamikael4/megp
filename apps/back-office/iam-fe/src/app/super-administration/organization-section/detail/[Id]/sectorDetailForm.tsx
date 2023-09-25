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
  useLazyGetSectorByIdQuery,
  useAddSectorMutation,
  useDeleteSectorsMutation,
  useUpdateSectorsMutation,
} from '@/store/api/sector/sector.api';
import { notify } from '@/shared/ui/page';

/* Form schema */

type Sector = {
  name: string;
  description: string;
};

/* Component props type */
type SectorDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const SectorDetailForm = (props: SectorDetailFormProps) => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  /* Hooks */

  const sectorSchema: ZodType<Sector> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Sector>({ resolver: zodResolver(sectorSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [
    trigger,
    { data: sector, isLoading: issectorLoading, isSuccess: issectorSuccess },
  ] = useLazyGetSectorByIdQuery();

  const [
    createsector,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddSectorMutation();
  const [
    updatesector,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateSectorsMutation();

  const [
    deletesector,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteSectorsMutation();

  const handleCreate = async (data: any) => {
    try {
      const response = await createsector(data).unwrap();
      notify('success', 'sector created successfully');

      await router.push(
        `/super-administration/organization-section/detail/${response.id}`,
      );
    } catch (err) {
      notify('error', 'errors in creating sector');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updatesector({ ...data, id: id?.toString() });
      notify('success', 'sector updating successfully');
    } catch (err) {
      notify('error', 'sector updating successfully');
    }
  };
  const submitDelete = async () => {
    try {
      await deletesector(id?.toString()).unwrap();

      router.push('/super-administration/organization-section');
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
    if (props.mode === 'update' && issectorSuccess && sector !== undefined) {
      reset({
        name: sector?.name,
        description: sector?.description,
      });
    }
  }, [
    issectorSuccess,
    sector,
    sector?.code,
    sector?.description,
    sector?.name,
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
            label="Registration.Name"
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
            label="Registration.Description"
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

export default SectorDetailForm;
