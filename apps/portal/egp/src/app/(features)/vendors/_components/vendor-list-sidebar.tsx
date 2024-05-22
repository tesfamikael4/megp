import styles from './approved-sidebar.module.scss';
import { Box, TextInput, Text, Select } from '@mantine/core';
import { Button } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import { getNationalityValues } from '../../my-workspace/registration/new/_components/mockup/nationality';
import { formOfBusiness } from '../../my-workspace/registration/_constants';

export interface FilterObjectType {
  businessType: string | null;
  name: string;
  country: string | null;
  serviceName?: string | null;
  status?: string | null;
}
export interface ApprovedSidebarProps {
  filter: FilterObjectType;
  setFilter: any;
  handleFilter: (query: CollectionQuery) => void;
  isRejected?: boolean;
}

const initialSate: FilterObjectType = {
  businessType: null,
  name: '',
  country: null,
  serviceName: null,
  status: null,
};

export default function VendorFilterSidebar({
  filter = initialSate,
  setFilter,
  handleFilter,
  isRejected,
}: ApprovedSidebarProps) {
  const handleUpdateFilter = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };
  //   const { data } = useGetBPServicesQuery({});

  const handleReset = () => {
    setFilter(initialSate);
    handleFilter({ take: 15, skip: 0 });
  };
  return (
    <Section
      title="Filter By"
      collapsible={false}
      className={styles.sidebarwrapper}
    >
      <Box className={styles.formGroup}>
        <Text>Form of Business</Text>
        <Select
          data={formOfBusiness}
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
        <Text>Country Of Registration</Text>
        <Select
          data={getNationalityValues()}
          value={filter.country}
          name="country"
          searchable
          onChange={(value) => handleUpdateFilter('country', value)}
          placeholder="Select Country"
        />
      </Box>

      <Box className={styles.sidebarButtons}>
        <Button
          onClick={() => handleFilter({ take: 15, skip: 0 })}
          disabled={
            !filter.name &&
            !filter.businessType &&
            !filter.country &&
            !filter.serviceName &&
            !filter.status
          }
          className="bg-primary-900 text-white"
        >
          Filter
        </Button>
        <Button
          onClick={handleReset}
          disabled={
            !filter.name &&
            !filter.businessType &&
            !filter.country &&
            !filter.serviceName &&
            !filter.status
          }
          className="bg-red-700"
        >
          Clear
        </Button>
      </Box>
    </Section>
  );
}
