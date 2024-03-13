import { Box, Text } from '@mantine/core';

import { ProcurementDisposal } from './components/procurement-disposal';
import { Ipdc } from './components/ipcd';
import { Adhoc } from './components/adhoc';

export default function ProcurementInstutionDetail() {
  return (
    <>
      <Box className="bg-white rounded p-2">
        <Text fw={500} size="xl">
          Procurement Institution (Default)
        </Text>
      </Box>
      <ProcurementDisposal />

      <Ipdc />

      <Adhoc />
    </>
  );
}
