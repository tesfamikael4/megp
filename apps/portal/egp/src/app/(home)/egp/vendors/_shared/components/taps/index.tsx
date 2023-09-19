import { Tabs } from '@mantine/core';
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from '@tabler/icons-react';

const Taps = () => {
  return (
    <Tabs
      color="teal"
      variant="outline"
      radius="xs"
      orientation="vertical"
      defaultValue="gallery"
    >
      <Tabs.List>
        <Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}>
          Gallery
        </Tabs.Tab>
        <Tabs.Tab value="messages" icon={<IconMessageCircle size="0.8rem" />}>
          Messages
        </Tabs.Tab>
        <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery" pl="xs">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel value="messages" pl="xs">
        Messages tab content
      </Tabs.Panel>

      <Tabs.Panel value="settings" pl="xs">
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  );
};
