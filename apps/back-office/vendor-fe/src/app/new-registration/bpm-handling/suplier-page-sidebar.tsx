import styles from './supplier-sidebar.module.scss';
import { Select, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';
import { Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
export default function SupplierSidebarPage() {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <div className={styles.sidebarwrapper}>
      <Section title="Filters" isCollapsible={false}>
        <div className={styles.formGroup}>
          <span
            className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
          >
            By Request Status
          </span>
          <Select placeholder="task status" data={['Waiting', 'Picked']} />
        </div>
        <div className={styles.formGroup}>
          <span
            className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
          >
            By Customer Name
          </span>
          <TextInput
            inputWrapperOrder={['label', 'error', 'input', 'description']}
          />
        </div>
        <div className={styles.formGroup}>
          <span
            className={`${styles['custom-font-size']} ${styles['custom-text-color']}`}
          >
            Application date start from
          </span>
          <DatePickerInput
            placeholder="Pick date"
            value={value}
            onChange={setValue}
            mx="auto"
            maw={400}
          />
        </div>
        <div className={styles.sidebarButtons}>
          <Button>Filter</Button>
          <Button>Clear</Button>
        </div>
      </Section>
    </div>
  );
}
