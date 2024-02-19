'use client';
import { Stepper } from '@mantine/core';
import styles from './stepper.module.scss';
import { useRouter, usePathname } from 'next/navigation'; // Updated import
import { Section } from '@megp/core-fe';

function StyledStepper() {
  const router = useRouter();
  const path = usePathname();
  const routes = ['business-areas', 'payment'];

  const canAccessRoute = (route) => {
    // return routes.slice(0, routes.indexOf(accessLevel)).includes(route);
  };

  const activeStep = routes.indexOf(path.split('/')[4]);

  const handleStepClick = (stepIndex) => {
    // (canAccessRoute(routes[stepIndex]) || accessLevel == routes[stepIndex]) &&
    //   router.push(routes[stepIndex]);
  };

  return (
    <Section title="Steps to complete your upgrade" collapsible={false}>
      <Stepper
        classNames={styles}
        active={activeStep}
        onStepClick={handleStepClick}
        orientation="vertical"
      >
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
