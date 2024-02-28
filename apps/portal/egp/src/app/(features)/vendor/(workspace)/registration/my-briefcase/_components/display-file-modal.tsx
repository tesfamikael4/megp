import { DisplayFile } from '@/app/(features)/vendor/_components/display-file/display-file';
import { Modal, ModalProps } from '@mantine/core';
interface ShareModalProps extends ModalProps {
  fileName: string;
}

export const DisplayFileModal = ({ ...others }: ShareModalProps) => {
  return (
    <Modal
      title="File"
      opened={others.opened}
      onClose={others.onClose}
      size={'xl'}
      centered
    >
      {others.children}
      <DisplayFile url={others.fileName} filename={others.fileName} />
    </Modal>
  );
};
