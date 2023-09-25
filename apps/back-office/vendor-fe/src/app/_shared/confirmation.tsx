import { Button, Modal } from '@mantine/core';
import * as React from 'react';
export interface DeleteConfirmationModalProps {
  isModalOpened: boolean;
  confirmModal?: any;
  isModalClosed: any;
  modalTitle?: string;
  confirm_message?: string;
  id?: string; //id of the item to be deleted
  isConfirmLoading?: boolean;
  modalSize?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  modalRadius?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function DeleteConfirmationModal(props: DeleteConfirmationModalProps) {
  return (
    <Modal
      opened={props.isModalOpened}
      onClose={props.isModalClosed}
      title={props.modalTitle ?? 'Delete Modal'}
      centered
      size={props.modalSize ?? 'md'}
      radius={props.modalRadius ?? 'sm'}
      styles={{
        header: {
          borderBottom: '1px solid rgb(229 231 235)',
        },

        title: {
          color: 'rgb(0,0,0)',
          fontWeight: 'bold',
        },
      }}
    >
      <div className="text-black-700 mb-8  mt-2 font-light">
        {props.confirm_message ?? 'Do You Want to Delete This Item?'}
      </div>
      <div className="flex justify-end">
        <Button
          variant="default"
          className="focus:outline-red mx-1 rounded bg-gray-200 px-6   py-2 hover:bg-gray-200"
          onClick={props.isModalClosed}
        >
          No
        </Button>
        <Button
          type="button"
          className="bg-danger hover:bg-danger mx-1 rounded px-6 py-2 "
          component="button"
          loading={props.isConfirmLoading}
          onClick={() => props.confirmModal(props.id)}
        >
          Yes
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
