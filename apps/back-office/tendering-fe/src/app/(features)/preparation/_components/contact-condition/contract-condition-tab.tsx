import { Box, Container } from '@mantine/core';
import { Section } from '@megp/core-fe';
import React from 'react';
import PaymentForm from './payment-terms/payment-form';
import GeneralProvision from './contract/general-provision';
import ContractDelivarable from './contract/contract-delivarable';
import PaymentSchedule from './payment-terms/payment-schedule';
import Guarantees from './guarantees-liabilities/guarantees';
import Liabilities from './guarantees-liabilities/liabilities';

export default function ContractConditionTab() {
  return (
    <>
      <div className="text-lg font-medium mt-4 pt-4 pb-4">Contract</div>
      <div className="py-2">
        <Section
          title="Contract"
          collapsible={true}
          defaultCollapsed={true}
          className="capitalize my-1"
        >
          <GeneralProvision />
        </Section>
      </div>
      <div className="py-2">
        <Section
          title="Contract Deliverable"
          collapsible={true}
          defaultCollapsed={true}
          className="capitalize my-1"
        >
          <ContractDelivarable />
        </Section>
      </div>
      <div className="text-lg font-medium mt-4 pt-4 pb-4">
        Contract Payments
      </div>
      <div className="py-2">
        <Section
          title="Payment Terms"
          collapsible={true}
          defaultCollapsed={true}
          className="capitalize my-1"
        >
          <PaymentForm />
        </Section>
      </div>
      <div className="py-2">
        <Section
          title="Payment Schedule"
          collapsible={true}
          defaultCollapsed={true}
          className="capitalize my-1"
        >
          <PaymentSchedule />
        </Section>
      </div>
      <div className="text-lg font-medium mt-4 pt-4 pb-4">
        Guarantees and Liabilities
      </div>
      <div className="py-2">
        <Section
          title="Guarantees"
          collapsible={true}
          defaultCollapsed={true}
          className="capitalize my-1"
        >
          <Guarantees />
        </Section>
      </div>
      <div className="py-2">
        <Section
          title="Liabilities"
          collapsible={true}
          defaultCollapsed={true}
          className="capitalize my-1"
        >
          <Liabilities />
        </Section>
      </div>
    </>
  );
}
