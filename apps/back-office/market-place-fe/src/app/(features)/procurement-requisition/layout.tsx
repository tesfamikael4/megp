'use client';
import '@mantine/dates/styles.css';
import { Box } from '@mantine/core';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = createTheme({
    components: {
      MuiInput: {
        styleOverrides: {
          root: {
            backgroundColor: '#121212',
          },
        },
        defaultProps: {
          size: 'small', // set the default size to 'small'
        },
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box className="min-h-screen">{children}</Box>
      </ThemeProvider>
    </>
  );
}
