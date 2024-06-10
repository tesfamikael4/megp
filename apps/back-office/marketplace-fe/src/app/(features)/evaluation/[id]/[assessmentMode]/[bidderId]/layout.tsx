import React from 'react';
import AsssesmentLayout from '../../../_component/assesment.layout';

export default function BidderEvaluationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AsssesmentLayout>{children}</AsssesmentLayout>;
}
