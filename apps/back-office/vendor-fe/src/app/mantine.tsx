'use client';

import { CacheProvider } from '@emotion/react';
import {
  createEmotionCache,
  MantineProvider,
  MantineThemeOverride,
} from '@mantine/core';
import { useServerInsertedHTML } from 'next/navigation';
import './globals.css';
// must be created outside of the component to persist across renders
const cache = createEmotionCache({ key: 'my' });
cache.compat = true;

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  const theme: Partial<MantineThemeOverride> = {
    defaultRadius: 'sm',
    primaryColor: 'primary',
    primaryShade: 7,
    breakpoints: {
      xs: '36rem',
      sm: '48rem',
      md: '62rem',
      lg: '75rem',
      xl: '87.5rem',
    },

    colors: {
      primary: [
        '#f0f0fa',
        '#dddcee',
        '#b6b6de',
        '#8f8ecf',
        '#6d6bc2',
        '#5855ba',
        '#4d4ab8',
        '#3f3ca2',
        '#363591',
        '#2d2d80',
      ],
    },

    components: {
      Container: {
        defaultProps: {
          sizes: {
            xs: 540,
            sm: 720,
            md: 960,
            lg: 1140,
            xl: 1320,
          },
        },
      },
      Button: {
        defaultProps: {
          size: 'sm',
        },
      },

      Input: {
        defaultProps: {
          size: 'sm',
        },
      },
      TextInput: {
        defaultProps: {
          size: 'sm',
        },
      },
      NumberInput: {
        defaultProps: {
          size: 'sm',
        },
      },
      Select: {
        defaultProps: {
          size: 'sm',
        },
      },
      PasswordInput: {
        defaultProps: {
          size: 'sm',
        },
      },
    },
  };

  return (
    <CacheProvider value={cache}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={cache}
        theme={theme}
      >
        {children}
      </MantineProvider>
    </CacheProvider>
  );
}
