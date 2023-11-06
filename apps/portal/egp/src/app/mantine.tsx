import '@mantine/core/styles.css';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';

import { theme as baseTheme } from '@/utilities/theme';

import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

import { Notifications } from '@mantine/notifications';

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme: Partial<MantineThemeOverride> = baseTheme;

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  );
}
