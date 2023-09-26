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
  useAddUnitTypeMutation,
  useUpdateUnitTypeMutation,
  useLazyGetUnitTypeByIdQuery,
  useDeleteUnitTypeMutation,
} from '@/store/api/unitType/unitType.api';
import { useLazyGetUnitTypeQuery } from '@/store/api/unitType/unitType.api';
import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type unitType = {
  name: string;
  description: string;
};

/* Component props type */
type unitTypeDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const UnitTypeDetailForm = (props: unitTypeDetailFormProps) => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  /* Hooks */

  const unitSchema: ZodType<unitType> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<unitType>({ resolver: zodResolver(unitSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [
    trigger,
    {
      data: unitType,
      isLoading: isunitTypeLoading,
      isSuccess: isunitTypeSuccess,
    },
  ] = useLazyGetUnitTypeByIdQuery();
  const [
    triggerunitTypes,
    {
      data: unitTypes,
      isLoading: isunitTypesLoading,
      isSuccess: isunitTypesSuccess,
    },
  ] = useLazyGetUnitTypeQuery();

  const [
    createunitType,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddUnitTypeMutation();
  const [
    updateunitType,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateUnitTypeMutation();

  const [
    deleteunitType,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteUnitTypeMutation();

  const handleCreate = async (data: any) => {
    try {
      const response = await createunitType({
        ...data,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      }).unwrap();
      notify('success', 'unitType created successfully');

      await router.push(`/unit-type/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating unitType');
    }
  };

  const handleUpdate = async (data: any) => {
    console.log({ ...data, id: id?.toString() });
    try {
      await updateunitType({
        ...data,
        id: id?.toString(),
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      notify('success', 'unitType updating successfully');
    } catch (err) {
      notify('error', 'unitType updating successfully');
    }
  };
  const submitDelete = async () => {
    try {
      await deleteunitType(id?.toString()).unwrap();

      router.push('/unit-type');
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
      triggerunitTypes(true);
    }
  }, [id, props.mode, trigger, triggerunitTypes]);

  useEffect(() => {
    if (
      props.mode === 'update' &&
      isunitTypeSuccess &&
      unitType !== undefined
    ) {
      reset({
        name: unitType?.name,

        description: unitType?.description,
      });
    }
  }, [isunitTypeSuccess, props.mode, reset, unitType]);
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

        <Divider className="mt-4 " />

        {props.mode == 'new' && (
          <Button
            type="submit"
            className={Style.buttonprimary}
            size="xs"
            loading={isCreating}
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
        modalTitle={'Delete unitType'}
        confirm_message={'Are you Sure to Delete This Item ?'}
      />
    </Card>
  );
};

export default UnitTypeDetailForm;
