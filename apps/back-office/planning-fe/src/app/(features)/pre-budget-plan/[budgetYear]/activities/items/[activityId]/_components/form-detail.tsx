'use client';

import { PreBudgetPlanItems } from '@/models/pre-budget-plan-items';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Center,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import ItemSelector from './item-selector';
import { useLazyReadQuery as ReadActivityQuery } from '../../../(activities)/_api/activities.api';
import { useParams, useRouter } from 'next/navigation';
import { useLazyGetUnitOfMeasurementsQuery } from '@/store/api/administration/administration.api';
import {
  useCreateMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/items.api';
import { notifications } from '@mantine/notifications';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const itemSchema: ZodType<Partial<PreBudgetPlanItems>> = z.object({
  // description: z.string().min(1, { message: 'Description is required' }),
  unitPrice: z.number().min(1, { message: 'Estimated unit price is required' }),
  currency: z.string({
    required_error: 'Currency is required',
  }),
  quantity: z.number().min(1, { message: 'Quantity is required' }),
  uom: z.string({
    required_error: 'Unit of measurement is required',
  }),
});

export const FormDetail = ({ mode }: FormDetailProps) => {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm<PreBudgetPlanItems>({
    resolver: zodResolver(itemSchema),
  });
  const router = useRouter();
  const { budgetYear, activityId, id } = useParams();

  const [specification, setSpecifications] = useState({
    General: [],
  });
  const [selectedItem, setSelectedItem] = useState<any>({});

  //rtk query
  const [
    getActivity,
    {
      data: activity,
      isLoading: isActivityLoading,
      isSuccess: isActivitySuccess,
    },
  ] = ReadActivityQuery();
  const [getUoM, { data: Uom, isLoading: isUomLoading }] =
    useLazyGetUnitOfMeasurementsQuery();

  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [
    read,
    { data: item, isLoading: isItemLoading, isSuccess: isItemSuccess },
  ] = useLazyReadQuery();

  //specification
  const Specification = () => {
    const [addValueFor, setAddValueFor] = useState('');
    const [addCategories, setAddCategories] = useState(false);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const onAddCategorie = () => {
      setSpecifications({ ...specification, [newCategory]: [] });
      setAddCategories(false);
    };
    const onAddValue = () => {
      setSpecifications({
        ...specification,
        [addValueFor]: [
          ...specification[addValueFor],
          { key: newKey, value: newValue },
        ],
      });
      setAddValueFor('');
    };
    const onDeleteData = (category, index) => {
      const updatedSpecs = { ...specification };
      updatedSpecs[category].splice(index, 1);
      setSpecifications(updatedSpecs);
    };
    return (
      <>
        <Flex justify="space-between">
          <Text size="sm" fw={500}>
            Specification
          </Text>
          <Text
            className="text-sm font-semibold  cursor-pointer text-slate-500"
            onClick={() => setAddCategories(true)}
          >
            + Add Categories
          </Text>
          {/* <Button onClick={() => setAddCategories(true)}>Add Categories</Button> */}
        </Flex>
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Tbody>
            {Object.keys(specification).map((key) => (
              <>
                <Table.Tr>
                  <Table.Td className="bg-slate-200 font-semibold text-center w-1/4">
                    {key}
                  </Table.Td>
                  <Table.Td className="bg-slate-200"></Table.Td>
                  <Table.Td className="bg-slate-200  w-1/6">
                    <IconPlus
                      className="ml-auto cursor-pointer"
                      onClick={() => setAddValueFor(key)}
                    />
                  </Table.Td>
                </Table.Tr>
                {specification[key].map((spec, index) => {
                  return (
                    <>
                      <Table.Tr>
                        <Table.Td className="bg-slate-200 font-semibold w-1/4">
                          {spec.key}
                        </Table.Td>
                        <Table.Td>{spec.value}</Table.Td>
                        <Table.Td>
                          <IconTrash
                            className="ml-auto cursor-pointer"
                            onClick={() => onDeleteData(key, index)}
                          />
                        </Table.Td>
                      </Table.Tr>
                    </>
                  );
                })}
                {addValueFor == key && (
                  <Table.Tr>
                    <Table.Td className="bg-slate-200 ">
                      <TextInput
                        placeholder="Add specification title"
                        value={newKey}
                        onChange={(data) => setNewKey(data.target.value)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <TextInput
                        placeholder="Add specification detail"
                        value={newValue}
                        onChange={(data) => setNewValue(data.target.value)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text
                        className="ml-auto cursor-pointer"
                        onClick={onAddValue}
                      >
                        Add
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </>
            ))}

            {addCategories && (
              <Table.Tr>
                <Table.Td className="bg-slate-200 font-semibold">
                  <TextInput
                    placeholder="Category Title"
                    value={newCategory}
                    onChange={(data) => setNewCategory(data.target.value)}
                  />
                </Table.Td>
                <Table.Td className="bg-slate-200"></Table.Td>
                <Table.Td className="bg-slate-200">
                  <Text
                    onClick={onAddCategorie}
                    className="ml-auto cursor-pointer"
                  >
                    Add
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </>
    );
  };

  //event handeler
  const onCreate = async (data) => {
    const rawData = {
      ...data,
      preBudgetPlanActivityId: activityId,
      description: selectedItem?.description,
      metaData: selectedItem,
      itemCode: selectedItem?.itemCode,
      specification: specification,
      measurement: selectedItem?.measurementId,
    };
    logger.log(rawData);

    try {
      const res = await create(rawData).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Item Created Success-fully',
        color: 'green',
      });
      router.push(
        `/pre-budget-plan/${budgetYear}/activities/items/${activityId}/${res.id}`,
      );
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    const rawData = {
      id,
      ...data,
      preBudgetPlanActivityId: activityId,
      description: selectedItem?.description,
      metaData: selectedItem,
      itemCode: selectedItem?.itemCode,
      specification: specification,
      measurement: selectedItem?.measurementId,
    };
    logger.log(rawData);
    try {
      await update(rawData).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Item Updated Success-fully',
        color: 'green',
      });
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };
  const onError = (err) => {
    logger.log(err);
  };
  const onReset = () => {
    reset({
      quantity: undefined,
      unitPrice: undefined,
    });
    setSelectedItem({});
    setSpecifications({
      General: [],
    });
  };

  //use effect
  useEffect(() => {
    getActivity(activityId as string);
  }, [activityId]);
  useEffect(() => {
    if (isActivitySuccess) {
      setValue('currency', activity.currency);
    }
  }, [activity, isActivitySuccess, setValue]);
  useEffect(() => {
    getUoM(selectedItem?.measurementId ?? '');
    setValue('uom', selectedItem?.uOMId);
  }, [getUoM, selectedItem]);

  useEffect(() => {
    mode === 'detail' && read(id as string);
  }, [mode, id, read]);

  useEffect(() => {
    if (isItemSuccess) {
      setValue('uom', item.uom);
      setValue('currency', item.currency);
      setValue('unitPrice', item.unitPrice);
      setValue('quantity', item.quantity);
      setSelectedItem(item.metaData);
      setSpecifications(item.specification);
    }
  }, [isItemSuccess, item, setValue]);
  return (
    <>
      {mode == 'new' && Object.keys(selectedItem).length == 0 && (
        <ItemSelector onDone={(item) => setSelectedItem(item)} />
      )}
      {(mode == 'detail' || Object.keys(selectedItem).length != 0) && (
        <Stack pos="relative">
          <LoadingOverlay
            visible={isActivityLoading || isUomLoading || isItemLoading}
          />
          <Table highlightOnHover withTableBorder withColumnBorders>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className="bg-slate-200 font-semibold w-1/5">
                  Commodity
                </Table.Td>
                <Table.Td>
                  {selectedItem?.commodityCode} | {selectedItem?.commodityName}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className="bg-slate-200 font-semibold">
                  Category
                </Table.Td>
                <Table.Td>{selectedItem?.itemSubcategoryName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className="bg-slate-200 font-semibold">
                  Item Code
                </Table.Td>
                <Table.Td>{selectedItem?.itemCode}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td className="bg-slate-200 font-semibold">
                  Description
                </Table.Td>
                <Table.Td>{selectedItem?.description}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Flex gap="md">
            <Controller
              name="currency"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  label="Currency"
                  data={['USD', 'EUR']}
                  withAsterisk
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={errors?.currency?.message}
                  disabled
                />
              )}
            />
            <Controller
              name="unitPrice"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <NumberInput
                  name={name}
                  value={value}
                  onChange={(data) => onChange(parseInt(data as string))}
                  withAsterisk
                  label="Estimated Unit Price"
                  thousandSeparator=","
                  error={errors?.unitPrice?.message}
                />
              )}
            />
            <Controller
              name="quantity"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <NumberInput
                  name={name}
                  value={value}
                  onChange={(data) => onChange(parseInt(data as string))}
                  withAsterisk
                  label="Quantity"
                  thousandSeparator=","
                  error={errors?.quantity?.message}
                />
              )}
            />

            <Controller
              name="uom"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="Unit of Measurement"
                  data={
                    Uom?.items?.map((u) => ({
                      value: u.id,
                      label: u.name,
                    })) ?? []
                  }
                  withAsterisk
                  error={errors?.uom?.message}
                />
              )}
            />
          </Flex>
          <Specification />

          <EntityButton
            mode={mode}
            isSaving={isCreating}
            isUpdating={isUpdating}
            onCreate={handleSubmit(onCreate, onError)}
            onReset={onReset}
            onUpdate={handleSubmit(onUpdate, onError)}
            onDelete={handleSubmit(onUpdate)}
          />
        </Stack>
      )}
    </>
  );
};
