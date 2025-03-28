import {
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
  useLazyListByIdQuery,
} from '../_api/unit.api';
import { useLazyListByIdQuery as useLazyUnitTypeListQuery } from '../../unit-type/_api/unit-type.api';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Unit } from '@/models/unit';
import { ParentModal } from './parentModal';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';
import React from 'react';
import UnitTypeDetailPage from '../../unit-type/[id]/page';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  shortName: '',
  parentId: null,
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const unitSchema: ZodType<Partial<Unit>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    shortName: z.string().min(1, { message: 'This field is required' }),
    description: z.string().optional(),
    parentId: z.string().optional().default(''),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(unitSchema),
  });
  const router = useRouter();
  const { id } = useParams();
  const { organizationId } = useAuth();

  const [parents, setParents] = useState<Unit[]>([]);
  const [parent, setParent] = useState<Unit[]>([]);
  const [parentUnitId, setParentUnitId] = useState<string>('');
  const [unitTypeId, setUnitTypeId] = useState<string | null>('');
  const [unitErr, setUnitErr] = useState<string>('');

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [activation, { isLoading: isActivating }] = useUpdateMutation();
  const [getListById, { data: list, isSuccess }] = useLazyListByIdQuery();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const [triggerType, { data: unitType }] = useLazyUnitTypeListQuery();

  useEffect(() => {
    getListById({
      id: organizationId,
      collectionQuery: undefined,
    });
  }, [organizationId]);

  useEffect(() => {
    if (organizationId) {
      triggerType({
        id: organizationId,
        collectionQuery: undefined,
      });
    }
  }, [organizationId, triggerType]);

  useEffect(() => {
    if (isSuccess) {
      setParent(list?.items?.filter((unit) => unit.parentId === null) ?? []);
    }
  }, [isSuccess, list?.items]);

  useEffect(() => {
    if (isSuccess && mode === 'detail') {
      const posibleParent = list?.items?.filter((u: Unit) => {
        return u.id !== id && selected?.parentId !== id;
      });
      setParents(posibleParent ?? []);
    } else if (isSuccess) {
      setParents(list?.items ?? []);
    }
  }, [id, isSuccess, list?.items, mode, selected, selectedSuccess]);

  const onCreate = async (data) => {
    if (unitTypeId === '' || unitTypeId === null) {
      setUnitErr('This field is required');
    } else {
      try {
        setUnitErr('');
        const result = await create({
          ...data,
          typeId: unitTypeId,
          parentId: data?.parentId ? data?.parentId : parent[0].id,
          organizationId: organizationId,
        }).unwrap();

        router.push(`/units/${result.id}`);

        notify('Success', 'Unit created successfully');
      } catch (err) {
        if (err?.data?.message?.startsWith('duplicate key')) {
          notify('Error', 'Unit already exists');
        } else {
          notify('Error', 'Error in creating unit');
        }
      }
    }
  };
  const onUpdate = async (data) => {
    if (unitTypeId === '' || unitTypeId === null) {
      setUnitErr('This field is required');
    } else {
      try {
        await update({
          ...data,
          id: id?.toString(),
          organizationId: organizationId,
          typeId: unitTypeId,
        }).unwrap();
        notify('Success', 'Unit updated successfully');
      } catch (err) {
        if (err?.data?.message?.startsWith('duplicate key')) {
          notify('Error', 'Unit already exists');
        } else {
          notify('Error', 'Error in updating unit');
        }
      }
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notify('Success', 'Unit deleted successfully');

      router.push('/units');
    } catch (err) {
      notify(
        'Error',
        `${err?.data?.message === 'cant_delete_unit_with_users' ? 'Remove assigned user before deleting' : 'Error in deleting user'}`,
      );
    }
  };
  const onActivate = async (data) => {
    const dataSent = {
      ...data,
      status: selected?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      organizationId: organizationId,
    };

    try {
      await activation({ ...dataSent, id: id?.toString() }).unwrap();
      notify(
        'Success',
        `Unit ${selected?.status === 'ACTIVE' ? 'Deactivated' : 'Activated'} successfully`,
      );
    } catch {
      notify(
        'Error',
        `Error in ${selected?.status === 'ACTIVE' ? 'Deactivating' : 'Activating'}  Unit`,
      );
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
    setUnitTypeId('');
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        shortName: selected?.shortName,
        parentId: selected?.parentId,
        typeId: selected?.typeId,
        description: selected?.description,
      });
      setParentUnitId(selected?.parentId);
      setUnitTypeId(selected?.typeId);
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    reset({
      parentId: parentUnitId,
    });
  }, [parentUnitId, reset]);

  return (
    <Stack pos={'relative'}>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <TextInput
        withAsterisk
        label="Name"
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        {...register('name')}
      />

      <TextInput
        withAsterisk
        label="Short Name"
        error={errors?.shortName ? errors?.shortName?.message?.toString() : ''}
        {...register('shortName')}
      />
      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
      />

      <Controller
        name="typeId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            name="name"
            label="Unit Type"
            value={unitTypeId}
            error={unitErr}
            onChange={(value) => {
              setUnitTypeId(value);
              setUnitErr('');
            }}
            data={
              unitType?.items?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />
      <div className="flex">
        <div className="flex-1">
          <Controller
            name="parentId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                name={'name'}
                label="Parent Unit"
                value={value}
                readOnly
                error={
                  errors?.parentId ? errors?.parentId?.message?.toString() : ''
                }
                onChange={onChange}
                data={
                  parents?.map((unit: any) => ({
                    value: unit?.id,
                    label: unit?.name,
                  })) || []
                }
              />
            )}
          />
        </div>

        <div className="flex-shrink-0 mt-6 ">
          <ParentModal
            data={parents}
            parentUnitId={parentUnitId}
            setParentUnitId={setParentUnitId}
          />
        </div>
      </div>

      <EntityButton
        mode={mode}
        data={selected}
        onActivate={handleSubmit(onActivate)}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        isActivating={isActivating}
        entity="unit"
      />
    </Stack>
  );
}
