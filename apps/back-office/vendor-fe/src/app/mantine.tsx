'use client';

import { CacheProvider } from '@emotion/react';
import {
  createEmotionCache,
  MantineProvider,
  MantineThemeOverride,
} from '@mantine/core';
import { useServerInsertedHTML } from 'next/navigation';

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
        '#f6faf3',
        '#e9f5e3',
        '#d3eac8',
        '#afd89d',
        '#82bd69',
        '#61a146',
        '#4c8435',
        '#3d692c',
        '#345427',
        '#2b4522',
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
          size: 'md',
        },
      },

      Input: {
        defaultProps: {
          size: 'md',
        },
      },
      TextInput: {
        defaultProps: {
          size: 'md',
        },
      },
      NumberInput: {
        defaultProps: {
          size: 'md',
        },
      },
      Select: {
        defaultProps: {
          size: 'md',
        },
      },
      PasswordInput: {
        defaultProps: {
          size: 'md',
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
