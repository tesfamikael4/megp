import { zodResolver } from '@hookform/resolvers/zod';
import { toFormData } from '@/shared/core/utilities/to-form-data';
import { Button, Table, Tooltip } from '@mantine/core';
import * as Icon from '@tabler/icons-react';
import {
  DeleteConfirmationModal,
  EmptyIcon,
  FileInput,
  FilePreview,
  PageLoader,
  SharedButton,
  notify,
} from '@/shared/ui/page';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  useAddOrganizationMutation,
  useGetOrganizationsQuery,
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation,
  useGetOrganizationByIdQuery,
  useLazyGetOrganizationByIdQuery,
} from '@/store/api/organization/organization.api';
import { usePathname } from 'next/navigation';

const LogoAttachmentForm = (props: {
  status: 'update' | 'not-update';
  attachmentId: any;
  organizationStatus?: any;
}) => {
  const [mode, setMode] = useState<'new' | 'update'>('new');
  const [itemToBeUpdated, setItemToBeUpdated] = useState<string>();
  const [itemTobeDeleted, setItemTobeDeleted] = useState<any>();
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  /*yup schema */
  const schema = z.object({
    attachmentUrl: z.any(),
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

  const [trigger, { data: organizations, isLoading, isSuccess }] =
    useLazyGetOrganizationByIdQuery();

  const [
    addAttachment,
    { isLoading: creating, isSuccess: createStatus, isError: creatingError },
  ] = useAddOrganizationMutation();

  const [
    updateAttachment,
    { isLoading: updating, isSuccess: updateStatus, isError: updatingError },
  ] = useUpdateOrganizationMutation();
  const [deleteAttachment, { isLoading: deleting, isSuccess: deleteStatus }] =
    useDeleteOrganizationMutation();

  /*Creating and Updating organization Attachments */

  const onFinish = async (data: any) => {
    const formDataobj: any = {
      attachmentUrl: data?.attachmentUrl[0],
      organizationId: id?.toString(),
    };
    if (mode === 'update') {
      formDataobj.id = itemToBeUpdated;
    }
    if (mode === 'new') {
      try {
        await addAttachment({
          organizationId: id?.toString(),
          file: toFormData(formDataobj),
        }).unwrap();
        createStatus !== null && notify('success', 'Registered Successfully');

        reset();
      } catch (err) {
        creatingError !== null &&
          notify('error', 'Sorry Not Registered Successfully');
      }
    } else if (mode === 'update') {
      try {
        await updateAttachment({
          file: toFormData(formDataobj),
          id: itemToBeUpdated,
        }).unwrap();
        updateStatus !== null && notify('success', 'Updated Successfully');
      } catch (err) {
        updatingError !== null &&
          notify('error', 'Sorry Not Updated Successfully');
      }
    }
  };
  /*Handle show Resource modal when updating attachment */
  const handleUpdateAttachment = (currentItem: string) => {
    setItemToBeUpdated(currentItem);
    setMode('update');
  };

  /* Deleting Attachment */

  const submitDelete = async () => {
    try {
      await deleteAttachment({
        organizationId: id?.toString(),
        attachmentId: itemTobeDeleted,
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
      const selectedAttachment = organizations?.data?.attachments?.find(
        (item) => item?.id === itemToBeUpdated,
      );

      setValue('attachmentUrl', selectedAttachment?.attachmentUrl);
    }
  }, [mode, setValue, organizations?.data?.attachments, id, itemToBeUpdated]);

  useEffect(() => {
    return setItemToBeUpdated(id?.toString());
  }, [id]);

  useEffect(() => {
    if (isSuccess === true) {
      setSelectedResource(
        organizations?.data?.attachments?.find(
          (currentAttachment) => currentAttachment.id === itemToBeUpdated,
        ),
      );
    }
  }, [isSuccess, id, itemToBeUpdated, organizations?.data?.attachments]);
  //   useEffect(() => {
  //     if (props?.attachmentModalOpened === false) {
  //       trigger(id?.toString());

  //     }
  //   }, [id, trigger, props?.attachmentModalOpened]);

  /* */
  const items = organizations?.data?.attachmnets?.map((item: any) => {
    return items.attachmentUrl;
  });
  return (
    <>
      <form onSubmit={handleSubmit(onFinish)}>
        <div className="my-0 overflow-y-auto">
          <div className="my-4">
            <div className="w-full ">
              <FileInput
                maxFileSize={200000000}
                name="attachmentUrl"
                withPreview={true}
                reactHookFormRegister={register}
                reactHookFormSetValue={setValue}
                label={''}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 mb-4 flex justify-start ">
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

      {organizations?.data?.attachments?.length === 0 && (
        <tr className="border-b">
          <td colSpan={4}>
            <EmptyIcon />
          </td>
        </tr>
      )}
      {isLoading && <PageLoader />}
      {organizations?.data?.attachments?.length > 0 && (
        <Table className="my-2 overflow-x-auto">
          <thead>
            <tr className="bg-gray-100">
              <th>File</th>
              {props.status === 'not-update' ? (
                ''
              ) : (
                <th className="w-1">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="overflow-x-auto">
            {organizations?.data?.attachments?.map((item: any) => (
              <tr key={item.id}>
                <td>
                  {
                    <Tooltip label={'View file'}>
                      <div>
                        <FilePreview
                          modalTitle={'File Details'}
                          fileName={item?.fileType?.replace(/\//g, '.')}
                          fileUrl={`${'http'}/?filename=${
                            item.attachmentUrl
                          }&path=${item.attachmentUrl}&originalname=${
                            item.attachmentUrl
                          }&mimetype=${item.fileType}`}
                        />
                      </div>
                    </Tooltip>
                  }{' '}
                </td>
                {(props.organizationStatus === 'draft' ||
                  props.organizationStatus === 'for adjustment') && (
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
                          handleUpdateAttachment(item.id);
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
                )}
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

export default LogoAttachmentForm;
