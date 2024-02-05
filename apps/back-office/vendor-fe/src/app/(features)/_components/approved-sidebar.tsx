import styles from './approved-sidebar.module.scss';
import { Box, TextInput, Text, Select } from '@mantine/core';
import { Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { getNationalityValues } from './utils';
import { CollectionQuery } from '@megp/entity';
export default function VendorFilterSidebar({
  filter,
  setFilter,
  handleFilter,
}: {
  filter: {
    businessType: string;
    name: string;
    country: string;
  };
  setFilter: any;
  handleFilter: (query: CollectionQuery) => void;
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
      country: '',
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
        <Select
          data={[
            {
              label: 'Sole Proprietorship',
              value: 'soleProprietorship',
            },
            {
              label: 'Partnership',
              value: 'partnership',
            },
            {
              label: 'Private Limited Company',
              value: 'privateLimitedCompany',
            },
            {
              label: 'ShareCompany',
              value: 'shareCompany',
            },
            {
              label: 'Government-Owned Enterprise',
              value: 'governmentOwnedEnterprise',
            },
          ]}
          value={filter.businessType}
          name="businessType"
          onChange={(value) => handleUpdateFilter('businessType', value)}
          placeholder="Select Business Type"
        />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Company Name</Text>
        <TextInput
          value={filter.name}
          name="name"
          onChange={(e) => handleUpdateFilter(e.target.name, e.target.value)}
          placeholder="Enter Company Name"
        />
      </Box>
      <Box className={styles.formGroup}>
        <Text>Country</Text>
        <Select
          data={getNationalityValues()}
          value={filter.country}
          name="country"
          searchable
          onChange={(value) => handleUpdateFilter('country', value)}
          placeholder="Enter Country"
        />
      </Box>
      <Box className={styles.sidebarButtons}>
        <Button
          onClick={() => handleFilter({ take: 15, skip: 0 })}
          disabled={!filter.name && !filter.businessType && !filter.country}
          className="bg-primary-900 text-white"
        >
          Filter
        </Button>
        <Button
          onClick={handleReset}
          disabled={!filter.name && !filter.businessType && !filter.country}
          className="bg-red-700"
        >
          Clear
        </Button>
      </Box>
    </Section>
  );
}
