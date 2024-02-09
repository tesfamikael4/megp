'use client';
import { Stepper } from '@mantine/core';
import styles from './stepper.module.scss';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Updated import
import { usePrivilege } from '../../_context/privilege-context';
import { useGetVendorQuery } from '../../../_api/query';
import { useCallback, useEffect } from 'react';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { Section } from '@megp/core-fe';

function StyledStepper() {
  const { accessLevel, updateStatus, updateAccess } = usePrivilege();

  const router = useRouter();
  const path = usePathname();
  const routes = ['basic', 'detail', 'ppda', 'payment', 'doc', 'review'];

  const { data, error } = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }

    if (data?.initial) {
      updateAccess(data?.initial.level);
      updateStatus(data?.initial.status);
      if (
        data?.initial.status === 'Submitted' ||
        data?.initial.status === 'Approved'
      ) {
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
    <Section title="Steps to becoming a registered Vendor" collapsible={false}>
      <Stepper
        classNames={styles}
        active={activeStep}
        onStepClick={handleStepClick}
        orientation="vertical"
        color="teal"
      >
        <Stepper.Step
          completedIcon={1}
          label="Basic Information"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
        />
        <Stepper.Step
          completedIcon={2}
          label="Profile Information"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
        />
        <Stepper.Step
          completedIcon={3}
          label="Purpose of Registration"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
        />
        <Stepper.Step
          completedIcon={4}
          label="Payment"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
        />
        <Stepper.Step
          completedIcon={5}
          label="Document Attachment"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
        />
        <Stepper.Step
          completedIcon={6}
          label="Review & Submit"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
        />
      </Stepper>
    </Section>
  );
}
export default StyledStepper;
