'use client';

import { CacheProvider } from '@emotion/react';
import { createEmotionCache, MantineProvider } from '@mantine/core';
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

  return (
    <CacheProvider value={cache}>
      <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={cache}>
        {children}
      </MantineProvider>
    </CacheProvider>
  );
}
