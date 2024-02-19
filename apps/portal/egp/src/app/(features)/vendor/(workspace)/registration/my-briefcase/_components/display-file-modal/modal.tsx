import { DisplayFile } from '@/app/(features)/vendor/_components/display-file/display-file';
import { Box, Modal, ModalProps, TextInput, Button, Flex } from '@mantine/core';
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
    >
      {others.children}
      <DisplayFile url={others.fileName} filename={others.fileName} />
    </Modal>
  );
};
