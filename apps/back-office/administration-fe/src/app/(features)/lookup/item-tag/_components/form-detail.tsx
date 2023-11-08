'use client';
import { Section } from '@megp/core-fe';
import React, { useEffect, useState } from 'react';
import { Text, TextInput } from '@mantine/core';
import {
  useListQuery,
  useDeleteMutation,
  useCreateMutation,
  useUpdateMutation,
  useReadQuery,
} from '../_api/tag.api';
import { notifications } from '@mantine/notifications';
import { EntityButton } from '@megp/entity';
import { useParams, useRouter } from 'next/navigation';

interface ItemTagFormPropType {
  mode: 'new' | 'detail';
}
export function ItemTagForm(props: ItemTagFormPropType) {
  const { mode } = props;
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { data } = useListQuery();

  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const [add, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const { data: selectedTag, isSuccess: selectedFetched } = useReadQuery(
    id as string,
  );

  useEffect(() => {
    if (mode === 'detail' && selectedFetched) setName(selectedTag?.name ?? '');
  }, [mode, selectedFetched, selectedTag]);

  const removeTag = async () => {
    remove(id as string)
      .unwrap()
      .then(() => {
        notifications.show({ message: 'Tag deleted!' });
        router.push('/lookup/item-tag');
      })
      .catch((error) => {
        notifications.show({ message: error?.message });
      });
  };
  const addTag = async () => {
    if (!name) {
      setError('Tag name is required.');
      return;
    }
    if (
      data?.items
        .map((item) => item.name.toLowerCase())
        .indexOf(name.toLowerCase()) !== -1
    ) {
      setError('Tag name exist.');
      return;
    }
    add({ name })
      .unwrap()
      .then(() => {
        notifications.show({ message: 'Tag added successfully!' });
        setName('');
      })
      .catch((error) => {
        notifications.show({ message: error?.message });
      });
  };
  const updateTag = async () => {
    if (!name) {
      setError('Tag name is required');
      return;
    }
    update({ id, name })
      .unwrap()
      .then(() => {
        notifications.show({ message: 'Tag name updated successfully!' });
        setName('');
      })
      .catch((error) => {
        notifications.show({ message: error?.message });
      });
  };
  const reset = () => {
    setName('');
    setError('');
  };
  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setName(val);
    setError('');
  };

  return (
    <Section
      title={mode === 'new' ? 'New Tag' : 'Update Tag'}
      collapsible={false}
      className="min-h-[260px] pb-5"
    >
      <form>
        <Text>Tag Name</Text>
        <TextInput
          value={name}
          onChange={onInputChange}
          mt={'xs'}
          w={'300'}
          placeholder="Enter name"
        />
        {error && (
          <Text size="md" c={'red'} className="mt-1">
            {error}
          </Text>
        )}
        <div className="mt-9">
          <EntityButton
            mode={mode}
            onCreate={addTag}
            onUpdate={updateTag}
            onDelete={removeTag}
            onReset={reset}
            isSaving={isSaving}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        </div>
      </form>
    </Section>
  );
}
