import { useState } from 'react';
import styles from './requests-sidebar.module.scss';
import { Box, Select, TextInput, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Button } from '@mantine/core';
import { Section } from '@megp/core-fe';

type InitialState = {
  trackingNumber: string;
  status: 'Goods' | 'Services' | 'Works' | null;
  customerName: string;
  from: Date | null;
  to: Date | null;
};
const initialState: InitialState = {
  trackingNumber: '',
  status: null,
  customerName: '',
  from: null,
  to: null,
};
export default function RequestsSidebar({
  handleFilter,
}: {
  handleFilter: (filter: Partial<InitialState>) => void;
}) {
  const [filter, setFilter] = useState(initialState);

  const updateFilter = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFilter(initialState);
  };

  const disabled =
    !filter.trackingNumber &&
    !filter.status &&
    !filter.from &&
    !filter.to &&
    !filter.customerName;

  return (
    <Section
      title="Filter By"
      collapsible={false}
      className={styles.sidebarwrapper}
    >
      <Box className={styles.formGroup}>
        <Text>Tracking Number</Text>
        <TextInput
          value={filter.trackingNumber}
          type="string"
          name="trackingNumber"
          placeholder="Tracking Number"
          onChange={(e) => updateFilter(e.target.name, e.target.value)}
        />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Business Category</Text>
        <Select
          value={filter.status}
          placeholder="Select Business Category"
          data={['Goods', 'Services', 'Works']}
          name={'status'}
          onChange={(e) => updateFilter('status', e)}
        />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Company Name</Text>
        <TextInput
          value={filter.customerName}
          name="customerName"
          placeholder="Company Name"
          onChange={(e) => updateFilter(e.target.name, e.target.value)}
        />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Application From</Text>
        <DatePickerInput
          value={filter.from}
          placeholder="Pick date"
          name="from"
          onChange={(e) => updateFilter('from', e)}
        />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Application To</Text>
        <DatePickerInput
          value={filter.to}
          placeholder="Pick date"
          name="to"
          onChange={(e) => updateFilter('to', e)}
        />
      </Box>
      <Box className={styles.sidebarButtons}>
        <Button
          onClick={() => handleFilter(filter)}
          disabled={disabled}
          className="bg-primary-900"
        >
          Filter
        </Button>
        <Button
          onClick={() => handleReset()}
          disabled={disabled}
          className="bg-red-700"
        >
          Clear
        </Button>
      </Box>
    </Section>
  );
}
