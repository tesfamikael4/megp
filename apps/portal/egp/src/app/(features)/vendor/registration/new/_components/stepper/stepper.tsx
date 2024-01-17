'use client';
import { Stepper } from '@mantine/core';
import styles from './stepper.module.scss';
import { useRouter, usePathname } from 'next/navigation'; // Updated import
import { usePrivilege } from '../../_context/privilege-context';
import { useGetVendorQuery } from '../../../_api/query';
import { useEffect } from 'react';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';

function StyledStepper() {
  const { accessLevel, updateStatus, updateAccess } = usePrivilege();

  const router = useRouter();
  const path = usePathname();
  const routes = ['basic', 'detail', 'ppda', 'payment', 'doc', 'review'];

  const { data, error } = useGetVendorQuery({});

  useEffect(() => {
    if (error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }

    if (data?.initial) {
      updateAccess(data?.initial.level);
      updateStatus(data?.initial.status);
      if (data?.initial.status === 'Submitted') {
        router.push(`/vendor/registration/track-applications`);
      } else return router.push((data?.initial.level).toLowerCase());
    }
    return () => {
      router.refresh();
    };
  }, [data, error]);

  const canAccessRoute = (route) => {
    return routes
      .slice(
        0,
        routes.indexOf(data?.initial.level?.toLowerCase() ?? accessLevel),
      )
      .includes(route);
  };

  const activeStep = routes.indexOf(
    data?.initial.level?.toLowerCase() ?? path.split('/')[4],
  );

  const handleStepClick = (stepIndex) => {
    (canAccessRoute(routes[stepIndex]) || accessLevel == routes[stepIndex]) &&
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
