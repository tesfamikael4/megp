import { Members } from '../_components/team-assignment.component';
import { Stack } from '@mantine/core';
import RFXHeader from '../_components/rfx-header';

export default function AssignmentPage() {
  return (
    <Stack>
      <RFXHeader />
      <Members />
    </Stack>
  );
}
