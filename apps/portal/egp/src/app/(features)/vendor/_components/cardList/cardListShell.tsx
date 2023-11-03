/* eslint-disable no-prototype-builtins */
import React, { useState } from 'react';
import {
  Flex,
  Button,
  Text,
  Modal,
  SimpleGrid,
  Card,
  ActionIcon,
  Center,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChangeHandler, useFieldArray } from 'react-hook-form';
import { IconPencil, IconPlus, IconTrash, IconX } from '@tabler/icons-react';

interface CardListProps {
  control: any;
  name: string;
  initialValues: object;
  itemSchema: any;
  title?: string;
  modalBody: (
    getInputProps: (
      fieldName: string,
      type?: 'input' | 'select' | 'checkbox',
    ) => {
      name: string;
      value: any;
      onChange: (props: ChangeHandler | any) => void;
      error: any;
    },
  ) => React.ReactNode;
  card: (
    edit: (index: number) => void,
    remove: (index: number) => void,
  ) => React.ReactNode;
}
export const CardListShell: React.FC<CardListProps> = ({
  control,
  name,
  initialValues,
  itemSchema,
  modalBody,
  card,
  title,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [modalType, setModalType] = useState<{
    type: 'ADD' | 'EDIT' | 'DELETE';
    id?: number;
  }>({ type: 'ADD' });
  const [item, setItem] = useState<{
    [key: string]: any;
  }>({ ...initialValues });

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: any;
  }>();

  const { fields, append, remove, update } = useFieldArray({ control, name });
  const fieldState = control.getFieldState(name, control._formState);

  const validateField = (field: string | any) => {
    if (typeof field === 'string') {
      const validation = itemSchema
        .pick({ [field]: true })
        .safeParse({ [field]: item[field] }) as {
        success: boolean;
        data?: any;
        error?: any;
      };
      if (validation.error) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [field]: validation.error.issues[0].message || 'error',
        }));
      }
      return false;
    }

    if (typeof field === 'object' && field) {
      const validation = itemSchema.safeParse({ ...field }) as {
        success: boolean;
        data?: any;
        error?: any;
      };

      if (validation.error) {
        for (const fieldName in validation.error.flatten().fieldErrors) {
          const fieldValidation = itemSchema
            .pick({ [fieldName]: true })
            .safeParse({ [fieldName]: item[fieldName] }) as {
            success: boolean;
            data?: any;
            error?: any;
          };

          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: fieldValidation.error.issues[0].message || 'error',
          }));
        }
        return false;
      }
    }
    return true;
  };

  const clearValidationError = (fieldName: string) => {
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };

  const getInputProps = (
    fieldName: string,
    type?: 'input' | 'select' | 'checkbox',
  ) => ({
    name: fieldName,
    value: item && item[fieldName] ? item[fieldName] : '',
    onChange:
      type == 'select'
        ? (e: any) =>
            setItem((prevItem) => ({
              ...prevItem,
              [fieldName]: e,
            }))
        : (e: React.ChangeEvent<HTMLInputElement>) =>
            setItem((prevItem) => ({
              ...prevItem,
              [e.target.name]: e.target.value,
            })),
    // onChange:
    // type == "select"
    //   ? async (e) => await setValue(name, e)
    //   : fieldRegister.onChange,
    error:
      validationErrors && validationErrors[fieldName]
        ? validationErrors[fieldName]
        : null,
    onFocus: () => clearValidationError(fieldName),
    onBlur: () => validateField(fieldName),
  });

  const handleAddItem = () => {
    if (validateField(item)) {
      modalType.type == 'ADD' && append(item);
      if ((modalType.type === 'EDIT' && modalType.id) || modalType.id == 0) {
        update(modalType.id, item);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setItem({ ...initialValues });
    setValidationErrors({});
    setModalType({
      type: 'ADD',
    });
    close();
  };
  const handleEdit = (index: number) => {
    setItem({ ...fields[index] });
    setModalType({
      type: 'EDIT',
      id: index,
    });
    open();
  };
  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <>
      <SimpleGrid cols={3} p="xs">
        {card(handleEdit, handleRemove)}
        <Card withBorder>
          <Center h={'100%'} mih="100px">
            <ActionIcon onClick={open} variant="outline" radius={'100%'}>
              <IconPlus size={33} stroke={1.2} />
            </ActionIcon>
          </Center>
          {/* <Flex
            className={`items-center justify-center border rounded-md first-letter:${
              fieldState?.error?.message
                ? 'border-[var(--mantine-color-error)]'
                : 'shadow-md'
            }`}
            onClick={open}
          ></Flex> */}
          {fieldState?.error?.message && (
            <span className="text-[var(--mantine-color-error)] text-xs">
              {fieldState?.error?.message}
            </span>
          )}
        </Card>
      </SimpleGrid>

      <Modal opened={opened} onClose={handleClose} size={'lg'} title={title}>
        {modalBody(getInputProps)}

        <Flex className="mt-6 justify-end gap-4">
          <Button onClick={handleAddItem}>Save</Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

interface SingleCardWrapperProps {
  remove: () => void;
  edit: () => void;
  children: React.ReactNode;
}
export const SingleCardWrapper: React.FC<SingleCardWrapperProps> = ({
  edit,
  remove,
  children,
}) => {
  return (
    <Card withBorder>
      <Card.Section>
        <Flex className="justify-end">
          <ActionIcon onClick={edit} variant="subtle">
            <IconPencil size={'1rem'} color="blue" />
          </ActionIcon>
          <ActionIcon onClick={remove} variant="subtle">
            <IconX size={'1rem'} color="red" />
          </ActionIcon>
        </Flex>
      </Card.Section>
      {children}
    </Card>
  );
};
