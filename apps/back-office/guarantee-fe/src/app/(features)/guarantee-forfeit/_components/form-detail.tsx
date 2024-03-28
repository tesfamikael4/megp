import { Button, Flex } from '@mantine/core';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

export function FormDetail({ mode }: FormDetailProps) {
  return (
    <>
      <Flex justify="flex-end" gap={10}>
        <Button className="mt-5">Accept</Button>
        <Button variant="outline" className="mt-5">
          Reject
        </Button>
      </Flex>
    </>
  );
}
