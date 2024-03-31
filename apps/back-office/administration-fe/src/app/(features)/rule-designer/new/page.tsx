import { Section } from '@megp/core-fe';
import React from 'react';
import RuleDesigner from '../_component/rule-designer';

export default function NewRule() {
  return (
    <div>
      <Section title="New Rule">
        <RuleDesigner mode={'new'} rule={[]} />
      </Section>
    </div>
  );
}
