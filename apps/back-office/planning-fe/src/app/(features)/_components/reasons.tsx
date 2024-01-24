import {
  Button,
  FileInput,
  Group,
  Modal,
  Select,
  Stack,
  Textarea,
} from '@mantine/core';

export const Reasons = ({
  opened,
  close,
  validationResult,
}: {
  opened: boolean;
  close: () => void;
  validationResult?: any;
}) => {
  return (
    <Modal opened={opened} onClose={close} size={'lg'} title="Justification">
      {/* <Text>Tessgjhsdfsh</Text> */}
      <Stack>
        <Select
          label="Possible Reasons"
          data={validationResult?.possibleReasons ?? ['Other']}
          withAsterisk
        />
        <Textarea label="Remark" withAsterisk />
        <FileInput label="Attachment" />
        <Group justify="end">
          <Button>Submit</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
