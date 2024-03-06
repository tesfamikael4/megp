import { MantineProvider, MantineThemeOverride } from '@mantine/core';

import { theme as baseTheme } from '@/utilities/theme';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme: Partial<MantineThemeOverride> = baseTheme;

  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
