'use client';
import { Stepper } from '@mantine/core';
import styles from './stepper.module.scss';
import { useRouter, usePathname } from 'next/navigation'; // Updated import
interface StyledStepperProps {
  initialStep: string;
}

function StyledStepper<StyledStepperProps>({ initialStep }) {
  const router = useRouter();
  const path = usePathname();
  const routes = ['basic', 'detail', 'ppda', 'payment', 'doc', 'review'];

  console.log(routes.slice(0, routes.indexOf(initialStep)).includes('detail'));
  const canAccessRoute = (route) => {
    return routes.slice(0, routes.indexOf(initialStep)).includes(route);
  };

  const activeStep = routes.indexOf(path.split('/')[4]);

  const handleStepClick = (stepIndex) => {
    (canAccessRoute(routes[stepIndex]) || initialStep == routes[stepIndex]) &&
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
      <Stepper.Step label="Profile Information" />
      <Stepper.Step label="Purpose of Registration" />
      <Stepper.Step label="Payment" />
      <Stepper.Step label="Document Attachment" />
      <Stepper.Step label="Review & Submit" />
    </Stepper>
  );
}
export default StyledStepper;
