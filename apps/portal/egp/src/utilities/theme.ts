import type { MantineThemeOverride } from '@mantine/core';

export const theme: Partial<MantineThemeOverride> = {
  defaultRadius: 'sm',
  primaryColor: 'primary',
  primaryShade: 7,
  breakpoints: {
    xs: '412px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  colors: {
    primary: [
      '#f6faf3',
      '#e9f5e3',
      '#d3eac8',
      '#afd89d',
      '#82bd69',
      '#1D8E3F',
      '#4c8435',
      '#1D8E3F',
      '#345427',
      '#2b4522',
    ],
  },
  components: {
    Container: {
      defaultProps: {
        sizes: {
          xs: 412,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
        },
      },
    },
    Button: {
      defaultProps: {
        size: 'xs',
      },
      styles: {
        section: {
          marginRight: 4,
          marginLeft: 1,
        },
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
    Breadcrumbs: {
      styles: {
        breadcrumb: {
          fontSize: '14px',
        },
      },
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: '#F3F4F6',
        },
        header: {
          height: 40,
        },
      },
    },
  },
};
