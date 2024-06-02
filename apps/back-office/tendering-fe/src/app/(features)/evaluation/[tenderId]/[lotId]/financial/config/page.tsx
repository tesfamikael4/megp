'use client';
import { useParams } from 'next/navigation';
import { LotOverview } from '../../../../_components/lot-overview';
import { Section } from '@megp/core-fe';
import { ItemRule } from '../_components/item-rule';
import { ConversionRate } from '../_components/conversion-rate';

export default function Financial() {
  const { tenderId } = useParams();

  return (
    <>
      <LotOverview
        milestone="financial"
        basePath={`/evaluation/${tenderId}`}
        hideComplete
      />
      <ConversionRate />
      <Section className="mt-2" title="Item Rules" collapsible={false}>
        <ItemRule />
      </Section>
    </>
  );
}
