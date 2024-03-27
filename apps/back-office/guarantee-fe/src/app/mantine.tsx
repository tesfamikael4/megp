'use client';

import { MantineProvider, MantineThemeOverride } from '@mantine/core';

import { theme as baseTheme } from '@megp/theme/mantine';

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme: Partial<MantineThemeOverride> = baseTheme;

  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
