import styles from './approved-sidebar.module.scss';
import { Box, TextInput, Text } from '@mantine/core';
import { Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
export default function VendorFilterSidebar({
  filter,
  setFilter,
  handleFilter,
}: {
  filter: {
    businessType: string;
    name: string;
  };
  setFilter: any;
  handleFilter: () => void;
}) {
  const handleUpdateFilter = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFilter({
      businessType: '',
      name: '',
    });
  };
  return (
    <Section
      title="Filter By"
      collapsible={false}
      className={styles.sidebarwrapper}
    >
      <Box className={styles.formGroup}>
        <Text>Business Type</Text>
        <TextInput
          value={filter.businessType}
          name="businessType"
          onChange={(e) => handleUpdateFilter(e.target.name, e.target.value)}
        />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Vendor Name</Text>
        <TextInput
          value={filter.name}
          name="name"
          onChange={(e) => handleUpdateFilter(e.target.name, e.target.value)}
        />
      </Box>
      <Box className={styles.sidebarButtons}>
        <Button
          onClick={() => handleFilter()}
          disabled={!filter.name && !filter.businessType}
        >
          Filter
        </Button>
        <Button
          onClick={handleReset}
          disabled={!filter.name && !filter.businessType}
        >
          Clear
        </Button>
      </Box>
    </Section>
  );
}
