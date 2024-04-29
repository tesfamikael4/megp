'use client';
import { Stepper } from '@mantine/core';
import styles from './stepper.module.scss';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Updated import
import { usePrivilege } from '../../_context/privilege-context';
import { useGetVendorQuery } from '../../../_api/query';
import { Suspense, useCallback, useEffect } from 'react';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { Section } from '@megp/core-fe';

function StyledStepper() {
  const { accessLevel, updateStatus, updateAccess } = usePrivilege();

  const router = useRouter();
  const path = usePathname();
  const routes = [
    'basic',
    'detail',
    'ppda',
    'preferential',
    'payment',
    'doc',
    'review',
  ];

  const { data, error } = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (error) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }
    if (data?.status === 'Approved' || data?.status === 'Completed') {
      return router.push('/my-workspace/service');
    }

    if (data?.initial) {
      updateAccess(data?.initial.level);
      updateStatus(data?.initial.status);
    }
    return () => {
      router.refresh();
    };
  }, [data?.status, data?.initial?.level, data?.initial?.status, error]);

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
    <Suspense>
      <Section
        title="Steps to becoming a registered Vendor"
        collapsible={false}
      >
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
            description="The TIN is the primary identifier and verification for user identity on the platform."
          />

          <Stepper.Step
            completedIcon={2}
            label="Profile Information"
            description="The MANEPS vendor candidate profile integrates vital details, ensuring transparency and secure bank account management for efficient government procurement"
          />
          <Stepper.Step
            completedIcon={3}
            label="Purpose of Registration"
            description="The registration process entails selecting categories (service, goods, and works), specifying a line of business, and establishing price ranges."
          />
          <Stepper.Step
            completedIcon={5}
            label="Eligibility to Preferential Treatment"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore "
          />
          <Stepper.Step
            completedIcon={4}
            label="Payment"
            description="Successful payment allows to be vendor to proceed; otherwise, progression is hindered until payment is confirmed, ensuring a systematic and accountable procurement process"
          />
          <Stepper.Step
            completedIcon={6}
            label="Document Attachment"
            description="In MANEPS, candidate vendors submit essential documents fostering a transparent and compliant verification process crucial for government procurement."
          />
          <Stepper.Step
            completedIcon={7}
            label="Review & Submit"
            description="Following a meticulous review, the user ensures information accuracy and compliance before successfully submitting the details"
          />
        </Stepper>
      </Section>
    </Suspense>
  );
}
export default StyledStepper;
