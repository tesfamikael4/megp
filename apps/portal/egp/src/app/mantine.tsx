import { MantineProvider, MantineThemeOverride } from '@mantine/core';

import { theme as baseTheme } from '@/utilities/theme';

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
