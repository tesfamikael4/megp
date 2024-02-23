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
  useListByIdQuery,
} from '../_api/unit.api';
import { useListByIdQuery as useUnitTypeListQuery } from '../../unit-type/_api/unit-type.api';
import { memo, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Unit } from '@/models/unit';
import { ParentModal } from './parentModal';
import { notify } from '@megp/core-fe';
import { useAuth } from '@megp/auth';
import React from 'react';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  shortName: '',
  typeId: null,
  parentId: null,
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const unitSchema: ZodType<Partial<Unit>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    shortName: z.string().min(1, { message: 'This field is required' }),

    typeId: z.string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required to be a string',
    }),
    description: z.string().optional(),

    parentId: z.string().optional(),
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

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [activation, { isLoading: isActivating }] = useUpdateMutation();
  const { data: list, isSuccess } = useListByIdQuery({
    id: organizationId,
    collectionQuery: undefined,
  });

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const { data: unitType } = useUnitTypeListQuery({
    id: organizationId,
    collectionQuery: undefined,
  });

  useEffect(() => {
    if (isSuccess) {
      setParent(list?.items?.filter((unit) => unit.parentId === null));
    }
  }, [isSuccess, list?.items]);

  useEffect(() => {
    if (isSuccess && mode === 'detail') {
      const posibleParent = list?.items?.filter((u: Unit) => {
        return u.id !== id && selected?.parentId !== id;
      });
      setParents(posibleParent);
    } else if (isSuccess) {
      setParents(list.items);
    }
  }, [id, isSuccess, list?.items, mode, selected?.parentId, selectedSuccess]);

  const onCreate = async (data) => {
    try {
      const result = await create({
        ...data,
        parentId: data?.parentId ? data?.parentId : parent[0].id,
        organizationId: organizationId,
      });
      if ('data' in result) {
        router.push(`/units/${result.data.id}`);
      }
      notify('Success', 'Unit created successfully');
    } catch (err) {
      notify('Error', 'Error in creating unit');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
        organizationId: organizationId,
      });
      notify('Success', 'Unit updated successfully');
    } catch {
      notify('Error', 'Error in updating unit');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'Unit deleted successfully');

      router.push('/units');
    } catch {
      notify('Error', 'Error in deleting unit');
    }
  };
  const onActivate = async (data) => {
    const dataSent = {
      ...data,
      status: selected?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      organizationId: organizationId,
    };

    try {
      await activation({ ...dataSent, id: id?.toString() });
      notify(
        'Success',
        `Unit ${selected?.isActive ? 'Deactivated' : 'Activated'} successfully`,
      );
    } catch {
      notify(
        'Error',
        `Error in ${selected?.isActive ? 'Deactivating' : 'Activating'}  Unit`,
      );
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };

  type SelectDropdownProps = {
    name: string;
    label: string;
    value: string;
    error: string | undefined;
    onChange: (value: string) => void;
    data: any[];
  };

  const SelectDropdown = memo(function SelectDropdown({
    name,
    label,
    value,
    error,
    onChange,
    data,
  }: SelectDropdownProps) {
    return (
      <Select
        name={name}
        label={label}
        value={value}
        withAsterisk
        error={error}
        onChange={onChange}
        data={data}
      />
    );
  });

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
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    reset({
      parentId: parentUnitId,
      name: selected?.name,
      shortName: selected?.shortName,
      typeId: selected?.typeId,
      description: selected?.description,
    });
  }, [parentUnitId, reset, selected, mode]);

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
        label="Short name"
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
          <SelectDropdown
            name="name"
            label="Unit Type"
            value={value}
            error={errors?.typeId ? errors?.typeId?.message?.toString() : ''}
            onChange={onChange}
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
            data={list ? list.items : []}
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
