'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Textarea, TextInput } from '@mantine/core';

import DeleteConfirmationModal from '@/shared/confirmation';

import * as Icon from '@tabler/icons-react';
import Style from './organizationDetailForm.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Select, Card } from '@mantine/core';
import {
  useAddUnitMutation,
  useDeleteUnitMutation,
  useLazyGetUniByIdQuery,
  useUpdateUnitMutation,
  useLazyGetUnitQuery,
} from '@/store/api/unit/unit.api';
import { useLazyGetUnitTypeQuery } from '@/store/api/unitType/unitType.api';
import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type Unit = {
  name: string;
  parentId: string;
  description: string;
  code?: string | null;
  typeId: string;
};

/* Component props type */
type UnitDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const UnitDetailForm = (props: UnitDetailFormProps) => {
  /* Router hooks */

  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  /* Hooks */

  const unitSchema: ZodType<Unit> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    parentId: z.string().min(1, { message: 'This field is required' }),
    code: z.string().optional().nullable(),
    description: z.string().min(1, { message: 'This field is required' }),
    typeId: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Unit>({ resolver: zodResolver(unitSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [
    trigger,
    { data: unit, isLoading: isUnitLoading, isSuccess: isUnitSuccess },
  ] = useLazyGetUniByIdQuery();
  const [
    triggerUnits,
    { data: units, isLoading: isUnitsLoading, isSuccess: isUnitsSuccess },
  ] = useLazyGetUnitQuery();

  const [triggerUnitType, { data: unitTypes, isLoading: isunitTypeLoading }] =
    useLazyGetUnitTypeQuery();

  const [
    createUnit,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddUnitMutation();
  const [
    updateUnit,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateUnitMutation();

  const [
    deleteUnit,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteUnitMutation();

  const handleCreate = async (data: any) => {
    try {
      const response = await createUnit({
        ...data,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      }).unwrap();
      notify('success', 'unit created successfully');

      await router.push(`/units/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating unit');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateUnit({
        ...data,
        id: id?.toString(),
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      notify('success', 'unit updating successfully');
    } catch (err) {
      notify('error', 'unit updating successfully');
    }
  };
  const submitDelete = async () => {
    try {
      await deleteUnit(id?.toString()).unwrap();

      router.push('/units');
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
      triggerUnits(true);
    }
  }, [id, props.mode, trigger, triggerUnits]);

  useEffect(() => {
    if (props.mode === 'update' && isUnitSuccess && unit !== undefined) {
      reset({
        name: unit?.name,
        parentId: unit?.parentId,
        typeId: unit?.typeId,
        description: unit?.description,
        code: unit?.code,
      });
    }
  }, [isUnitSuccess, props.mode, reset, unit]);
  /*  */

  useEffect(() => {
    triggerUnitType(true);
  }, [triggerUnitType]);

  useEffect(() => {
    const selected = units?.items?.filter((u) => {
      return u.id !== id && unit?.parentId !== u.id;
    });
    console.log(selected);
    setSelectedData(selected);
  }, [id, unit.ParentId, unit?.parentId, units?.items]);

  console.log(selectedData);
  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-4"></div>
        <Divider className="mt-4" />
        <div className="my-4">
          <TextInput
            className={Style.input}
            placeholder={'Code'}
            label="Code"
            error={errors?.code ? errors?.code?.message?.toString() : ''}
            disabled
            {...register('code')}
          />
        </div>
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

        <div className="my-4">
          <Controller
            name="typeId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Select
                withinPortal
                className={Style.select}
                label="unit Type"
                value={value}
                name={name}
                required
                onChange={onChange}
                data={
                  unitTypes?.items?.map((type) => ({
                    value: type?.id,
                    label: type?.name,
                  })) || []
                }
              />
            )}
          />
        </div>
        <Divider className="mt-4" />

        <div className="my-4">
          <Controller
            name="parentId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Select
                withinPortal
                className={Style.select}
                label="Parent Unit"
                value={value}
                name={name}
                required
                onChange={onChange}
                data={
                  selectedData?.map((unit: any) => ({
                    value: unit?.id,
                    label: unit?.name,
                  })) || []
                }
              />
            )}
          />
        </div>
        <Divider className="mt-4" />

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

        {props.mode == 'update' && unit?.name !== 'root' && (
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

export default UnitDetailForm;
