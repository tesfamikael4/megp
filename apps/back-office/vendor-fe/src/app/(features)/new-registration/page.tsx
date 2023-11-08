'use client';
import { Grid } from '@mantine/core';
import styles from './vendor-requests/requests.module.scss';

import RequestsSidebarPage from './vendor-requests/requests-sidebar';
import RequestsPage from './vendor-requests/page';

export default function SupplierPages() {
  return (
    <Grid className={styles.wrapper}>
      <Grid.Col span={9}>
        <RequestsPage />
      </Grid.Col>
      <Grid.Col span={3}>
        <RequestsSidebarPage />
      </Grid.Col>
    </Grid>
  );
}
