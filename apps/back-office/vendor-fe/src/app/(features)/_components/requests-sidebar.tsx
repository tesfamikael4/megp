import styles from './requests-sidebar.module.scss';
import { Box, Select, TextInput, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
export default function RequestsSidebar() {
  return (
    <Section
      title="Filter By"
      collapsible={false}
      className={styles.sidebarwrapper}
    >
      <Box className={styles.formGroup}>
        <Text>Tracking number</Text>
        <TextInput />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Request Status</Text>
        <Select placeholder="Task status" data={['Waiting', 'Picked']} />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Customer Name</Text>
        <TextInput />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Application From</Text>
        <DatePickerInput placeholder="Pick date" />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Application To</Text>
        <DatePickerInput placeholder="Pick date" />
      </Box>
      <Box className={styles.sidebarButtons}>
        <Button>Filter</Button>
        <Button>Clear</Button>
      </Box>
    </Section>
  );
}
