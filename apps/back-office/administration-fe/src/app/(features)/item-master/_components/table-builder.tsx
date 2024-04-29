import { Box, Button, Group, LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Popup } from './template-modal';
import { notify } from '@megp/core-fe';
import { IconCirclePlus } from '@tabler/icons-react';
import {
  useCopyTemplateMutation,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useLazyGetTemplateQuery,
  useUpdateTemplateMutation,
} from '../_api/template.api';
import { useParams } from 'next/navigation';
import ItemSelector from './Item-selector';
import { DraggableTable } from './dragable';

export function Builder() {
  const [opened, { open, close }] = useDisclosure(false);
  const [copyModalOpend, { open: openCopyModal, close: closeCopyModal }] =
    useDisclosure(false);
  const [updatedItems, setUpdatedItems] = useState<any[]>([]);

  const { id } = useParams();

  const [trigger, { data, isSuccess, isLoading }] = useLazyGetTemplateQuery();
  const [createTemplate] = useCreateTemplateMutation();
  const [update] = useUpdateTemplateMutation();
  const [copy] = useCopyTemplateMutation();
  const [onRemove] = useDeleteTemplateMutation();

  const { control } = useForm<Partial<any>>({
    defaultValues: {
      specTemp: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'specTemp',
    control,
  });

  const onSave = async (data: any) => {
    try {
      await createTemplate({
        itemMasterId: id,
        quantity: 10,
        properties: updatedItems?.map((field: any) => {
          return {
            key: field.key,
            dataType: field?.dataType,
            validation: {
              type: field?.dataType,
              min: field?.min,
              max: field?.max,
              isRequired: field?.isRequired,
              enum: field?.selectFrom,
            },
            measurement: field?.measurement,
            uom: field?.uom,
            defaultValue: field?.defaultValue,
            displayName: field?.displayName,
            category: 'Basic specification',
            order: field.order,
          };
        }),
        deliveries: [],
      }).unwrap();
      setUpdatedItems([]);
      notify('Success', 'Created successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onUpdate = async () => {
    try {
      await update({
        id: data?.id,
        itemMasterId: id,
        quantity: 10,
        properties: updatedItems.map((field: any) => {
          return {
            key: field.key,
            dataType: field?.dataType,
            validation: {
              type: field?.dataType,
              min: field?.min,
              max: field?.max,
              isRequired: field?.isRequired,
              enum: field?.selectFrom,
            },
            measurement: field?.measurement,
            defaultValue: field?.defaultValue,
            displayName: field?.displayName,
            category: 'Basic specification',
          };
        }),
        deliveries: [],
      }).unwrap();
      setUpdatedItems([]);

      notify('Success', 'Template updated successfully');
    } catch (e) {
      notify('Error', 'Something went wrong!');
    }
  };

  const onDelete = async () => {
    try {
      await onRemove(data?.id?.toString()).unwrap();

      notify('Success', 'Template deleted successfully');
    } catch (e) {
      notify('Error', 'Something went wrong!');
    }
  };

  const handleCopy = async (data: any) => {
    try {
      await copy({
        itemMasterId: data?.id,
        newItemMasterId: id,
      }).unwrap();
      notify('Success', 'Template copied successfully');
    } catch (e) {
      notify('Error', 'Something went wrong!');
    }
  };

  useEffect(() => {
    trigger(id.toString());
  }, [id, isSuccess, trigger]);

  useEffect(() => {
    if (isSuccess) {
      append(data?.properties ?? []);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess) {
      setUpdatedItems(fields);
    }
  }, [fields, isSuccess]);

  return (
    <>
      <Box pos={'relative'} mih={'200px'}>
        <LoadingOverlay visible={isLoading} />
        <Group mt={20} mb={20}>
          <Group className="ml-auto">
            <Button onClick={open} leftSection={<IconCirclePlus size={20} />}>
              Add Template
            </Button>
            <Button
              onClick={openCopyModal}
              leftSection={<IconCirclePlus size={20} />}
            >
              Copy Template
            </Button>
          </Group>
        </Group>

        <DraggableTable
          data={updatedItems}
          remove={remove}
          setUpdatedItems={setUpdatedItems}
          open={open}
        />

        {isSuccess && updatedItems?.length > 0 ? (
          data?.properties ? (
            <>
              <Button onClick={onUpdate}>Update</Button>
              <Button onClick={onDelete} ml={'sm'} color="red">
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={onSave}>Save</Button>
          )
        ) : null}
        <Modal
          opened={opened}
          onClose={close}
          title={<Group fw={'bold'}>Add Specification Template Form</Group>}
          size={'lg'}
        >
          <Popup close={close} add={append} />
        </Modal>

        <ItemSelector
          close={closeCopyModal}
          onDone={handleCopy}
          opened={copyModalOpend}
        />
      </Box>
    </>
  );
}
