'use client';
import { Stepper } from '@mantine/core';
import styles from './stepper.module.scss';
import { useRouter, usePathname } from 'next/navigation'; // Updated import

function StyledStepper() {
  const router = useRouter();
  const path = usePathname();

  const routes = ['basic', 'detail', 'pdda', 'payment', 'doc', 'review'];

  const activeStep = routes.indexOf(path.split('/')[4]);
  const handleStepClick = (stepIndex) => {
    router.push(routes[stepIndex]);
  };

  return (
    <Stepper
      classNames={styles}
      active={activeStep}
      onStepClick={handleStepClick}
      orientation="vertical"
    >
      <Stepper.Step label="Basic Information" />
      <Stepper.Step label="Detailed Information" />
      <Stepper.Step label="PDDA Registration" />
      <Stepper.Step label="Payment" />
      <Stepper.Step label="Document Attachment" />
      <Stepper.Step label="Review & Submit" />
    </Stepper>
  );
}
export default StyledStepper;
