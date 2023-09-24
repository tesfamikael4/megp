import { zodResolver } from '@hookform/resolvers/zod';
import { toFormData } from '@/shared/core/utilities/to-form-data';
import {
  Button,
  Modal,
  Table,
  TextInput,
  Textarea,
  Tooltip,
} from '@mantine/core';
import * as Icon from '@tabler/icons-react';
import * as z from 'zod';
import {
  DeleteConfirmationModal,
  FileInput,
  FilePreview,
  PageLoader,
  SharedButton,
  notify,
} from '@/shared/ui/page';
import EmptyState from '@/shared/ui/empty';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'zod';
import {
  useLazyGetUnitTypeQuery,
  useGetUnitTypeQuery,
  useAddUnitTypeMutation,
  useUpdateUnitTypeMutation,
  useRemoveUnitTypeMutation,
} from '@/store/api/unit/unit.api';
import { usePathname } from 'next/navigation';

type UnitType = {
  name: string;
  description: string;
};

const UnitTypeForm = (props: {
  status: 'update' | 'not-update';
  attachmentModalOpened: boolean;
  setAttachmentModalOpened: (event: boolean) => void;
  unitstatus?: any;
}) => {
  const [mode, setMode] = useState<'new' | 'update'>('new');
  const [itemToBeUpdated, setItemToBeUpdated] = useState<string>();
  const [itemTobeDeleted, setItemTobeDeleted] = useState<any>();
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  /*yup schema */

  const schema: z.ZodType<UnitType> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });

  /*  */
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm({ resolver: zodResolver(schema) });

  /* Hooks */
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  const [trigger, { data: units, isLoading, isSuccess }] =
    useLazyGetUnitTypeQuery();

  const [
    addUnit,
    { isLoading: creating, isSuccess: createStatus, isError: creatingError },
  ] = useAddUnitTypeMutation();

  const [
    updateUnit,
    { isLoading: updating, isSuccess: updateStatus, isError: updatingError },
  ] = useUpdateUnitTypeMutation();
  const [deleteUnit, { isLoading: deleting, isSuccess: deleteStatus }] =
    useRemoveUnitTypeMutation();

  /*Creating and Updating Article Attachments */

  const onFinish = async (data: any) => {
    if (mode === 'new') {
      try {
        await addUnit(data).unwrap();
        createStatus !== null && notify('success', 'Registered Successfully');
        props.setAttachmentModalOpened(false);
        reset();
      } catch (err) {
        creatingError !== null &&
          notify('error', 'Sorry Not Registered Successfully');
      }
    } else if (mode === 'update') {
      try {
        (await updateUnit) !== null &&
          notify('success', 'Updated Successfully');
        props.setAttachmentModalOpened(false);
      } catch (err) {
        updatingError !== null &&
          notify('error', 'Sorry Not Updated Successfully');
      }
    }
  };
  /*Handle show Resource modal when updating attachment */
  const handleUpdateAUnitType = (currentItem: string) => {
    setItemToBeUpdated(currentItem);
    setMode('update');
    props.setAttachmentModalOpened(true);
  };

  /* Deleting Attachment */

  const submitDelete = async () => {
    try {
      await deleteUnit({
        unitId: id?.toString(),
      }).unwrap();
      deleteStatus !== null && notify('success', 'Deleted Successfully');
    } catch (err) {
      notify('error', 'Sorry Not Deleted Successfully');
    }
    setDisplayConfirmationModal(false);
  };
  /*Modal opened when delete button clicked */
  const showDeleteModal = (itemTobeDeleted: string) => {
    setItemTobeDeleted(itemTobeDeleted);
    setDisplayConfirmationModal(true);
  };

  /* Close confirmation Modal when attachment is Deleted */

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  /*useEffects */

  useEffect(() => {
    if (mode === 'update') {
      const selectedAttachment = units?.data?.attachments?.find(
        (item) => item?.id === itemToBeUpdated,
      );
      setValue('title', selectedAttachment?.title);
      setValue('attachmentUrl', selectedAttachment?.attachmentUrl);
    }
  }, [mode, setValue, units?.data?.attachments, id, itemToBeUpdated]);

  useEffect(() => {
    return setItemToBeUpdated(id?.toString());
  }, [id]);

  useEffect(() => {
    if (props.attachmentModalOpened === false) {
      setMode('new');
      reset({ title: '', attachmentUrl: '' });
      setItemToBeUpdated('');
    }
  }, [props.attachmentModalOpened, reset]);
  useEffect(() => {
    if (isSuccess === true) {
      setSelectedResource(
        units?.data?.attachments?.find(
          (currentAttachment) => currentAttachment.id === itemToBeUpdated,
        ),
      );
    }
  }, [isSuccess, id, itemToBeUpdated, units?.data?.attachments]);
  useEffect(() => {
    if (props?.attachmentModalOpened === false) {
      trigger(id?.toString());
    }
  }, [id, trigger, props?.attachmentModalOpened]);

  /* */
  const items = units?.data?.map((item: any) => {
    return items.attachmentUrl;
  });

  console.log(units);
  return (
    <>
      <Modal
        size={`lg`}
        opened={props.attachmentModalOpened}
        onClose={() => props.setAttachmentModalOpened(false)}
        title={mode === 'new' ? 'Add Unit type' : 'Update Unit type'}
        styles={{
          header: {
            borderBottom: '1px solid rgb(229 231 235)',
          },
          title: {
            color: 'rgb(0,0,0)',
            fontWeight: 600,
          },
        }}
      >
        <form onSubmit={handleSubmit(onFinish)}>
          <div className="my-0 overflow-y-auto">
            <TextInput
              className="mb-2"
              label={'Name'}
              placeholder={'Enter Name'}
              error={errors?.name ? errors?.name?.message?.toString() : ''}
              required
              {...register('name')}
            />
            <div className="my-4">
              <Textarea
                className="mb-2"
                label={'Description'}
                placeholder={'Enter description'}
                error={
                  errors?.description
                    ? errors?.description?.message?.toString()
                    : ''
                }
                required
                {...register('description')}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-start ">
            {mode === 'new' && (
              <SharedButton
                type="submit"
                size="xs"
                className="bg-primary"
                isLoading={creating}
                component="button"
                leftIcon={<Icon.IconDeviceFloppy size={16} />}
                label="Save"
              ></SharedButton>
            )}
            {mode === 'update' && (
              <SharedButton
                type="submit"
                className=" bg-primary"
                isLoading={updating}
                size="xs"
                component="button"
                leftIcon={<Icon.IconDeviceFloppy size={16} />}
                label="Update"
              ></SharedButton>
            )}
          </div>
        </form>
      </Modal>
      {(units?.data?.length === 0 || units?.data == undefined) && (
        <tr className="border-b flex justify-center">
          <td colSpan={4}>
            <EmptyState />
          </td>
        </tr>
      )}
      {isLoading && <PageLoader />}
      {units?.data?.attachments?.length > 0 && (
        <Table className="my-2 overflow-x-auto">
          <thead>
            <tr className="bg-gray-100">
              <th>Title</th>
              <th>File</th>
              {props.status === 'not-update' ? (
                ''
              ) : (
                <th className="w-1">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="overflow-x-auto">
            {units?.data?.attachments?.map((item: any) => (
              <tr key={item.id}>
                <td>{item?.name}</td>
                <td>{item?.description}</td>

                <td>
                  <div className="mx-auto my-2 flex justify-center space-x-2 ">
                    <Button
                      type="button"
                      className=" bg-primary"
                      size="xs"
                      component="button"
                      compact
                      onClick={() => {
                        setMode('update');
                        handleUpdateAUnitType(item.id);
                      }}
                    >
                      <Icon.IconEdit className="flex" size={16} />
                    </Button>
                    <Button
                      type="button"
                      className="bg-danger hover:bg-danger"
                      component="button"
                      compact
                      size="xs"
                      onClick={() => showDeleteModal(item.id)}
                    >
                      <Icon.IconTrash className="flex" size={16} />
                    </Button>
                    <div></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {displayConfirmationModal === true && (
        <DeleteConfirmationModal
          isModalOpened={displayConfirmationModal}
          confirmModal={submitDelete}
          isModalClosed={hideConfirmationModal}
          id={itemTobeDeleted}
          isConfirmLoading={deleting}
          modalTitle={'Delete Assigned Resources'}
          confirm_message={'Are you Sure to Delete This Item?'}
        />
      )}
    </>
  );
};

export default UnitTypeForm;
