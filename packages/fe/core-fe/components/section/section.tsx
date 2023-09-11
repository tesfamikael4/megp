'use client';

import { Button, Card, Collapse, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function Section({ children }): React.ReactElement {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card withBorder>
      <Group mb={5} position="center">
        <Button onClick={toggle}>Toggle content</Button>
      </Group>

      <Collapse in={opened}>
        <Text>{children}</Text>
      </Collapse>
    </Card>
  );
}
