'use client';

import { MantineProvider, MantineThemeOverride } from '@mantine/core';

import { theme as baseTheme } from '@megp/theme/mantine';

import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme: Partial<MantineThemeOverride> = baseTheme;

  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
