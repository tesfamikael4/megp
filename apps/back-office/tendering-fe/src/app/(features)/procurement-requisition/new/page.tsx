'use client';
import { FormDetail } from '../_components/form-detail';
import { Box, Divider } from '@mantine/core';

export default function NewPrPage() {
  return (
    <>
      <Box className="bg-white rounded shadow-sm ">
        <Box className="p-4 ">
          <div className=" text-lg font-medium   ">
            New Procurement requisition
          </div>
          <Divider mt={'md'} mb={'md'} />
          <FormDetail mode="new" />
        </Box>
      </Box>
    </>
  );
}
