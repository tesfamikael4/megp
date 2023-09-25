import CollapsibleCard from '@/shared/card/collabsableCard';
import { Box } from '@mantine/core';
import { PricingDetailForm } from './pricing-detail-form';

type PricingDetailProps = {
  mode: 'new' | 'update';
};

export const PricingDetail = (props: PricingDetailProps) => {
  return (
    <Box m={2}>
      <CollapsibleCard title="Pricing Form" dropped>
        <PricingDetailForm mode={props.mode} />
      </CollapsibleCard>
    </Box>
  );
};
