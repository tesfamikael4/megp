'use client';
import { Stepper } from '@mantine/core';
import styles from './stepper.module.scss';
import { useRouter, usePathname } from 'next/navigation';
import { Section } from '@megp/core-fe';

function StyledStepper() {
  const router = useRouter();
  const path = usePathname();
  const routes = ['ppda', 'payment'];

  const activeStep = routes.indexOf(path.split('/')[4]);

  return (
    <Section title="Steps to add additional services" collapsible={false}>
      <Stepper classNames={styles} active={activeStep} orientation="vertical">
        {/* <Stepper.Step label="Basic Information" /> */}
        <Stepper.Step
          label="Purpose of Registration"
          description="Choose Purpose of Registration for Renewal"
        />
        <Stepper.Step
          label="Payment"
          description={'Attach Payment Proof to finish your renewal'}
        />
      </Stepper>
    </Section>
  );
}
export default StyledStepper;
