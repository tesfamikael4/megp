import React from 'react';
import Pannel from '@/shared/pannel';
import { Select, Space, TextInput } from '@mantine/core';

const ExtendedProfile = ({ userId }: any) => {
  return (
    <Pannel
      title="Extended Profile"
      titleDescription="Update extra information"
      expanded={false}
    >
      <TextInput label="Office Telephone Number :" name="tel" />
      <Space h="md" />

      <TextInput label="Current Positions :" name="position" />
      <Space h="md" />

      <Select
        label="Gender"
        placeholder="Select"
        data={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]}
        required
      />
    </Pannel>
  );
};

export default ExtendedProfile;
