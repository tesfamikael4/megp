'use client';
import { Stepper } from '@mantine/core';
import styles from './stepper.module.scss';
import { useState } from 'react';

function StyledStepper() {
  const [active, setActive] = useState(0);

  return (
    <Stepper
      classNames={styles}
      active={active}
      onStepClick={setActive}
      orientation="vertical"
    >
      <Stepper.Step label="Vendor Basic Information" />
      <Stepper.Step label="Detailed Information" />
      <Stepper.Step label="PDDA Registration" />
      <Stepper.Step label="Payment" />
      <Stepper.Step label="Document Attachment" />
      <Stepper.Step label="Review & Submit" />
    </Stepper>
  );
}
export default StyledStepper;
