'use client';
import React, { useEffect } from 'react';
import FormPreview from '../../_components/review/form-preview';
import { useAddFormMutation, useGetVendorQuery } from '../../_api/query';
import { Button, Flex, LoadingOverlay, Stack } from '@mantine/core';
import { NotificationService } from '../../../_components/notification';
import { useRouter } from 'next/navigation';
import { usePrivilege } from '../_context/privilege-context';

function Page() {
  const router = useRouter();
  const requestInfo = useGetVendorQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const [save, saveValues] = useAddFormMutation();
  const { checkAccess, updateAccess, updateStatus } = usePrivilege();

  useEffect(() => {
    if (requestInfo.data?.initial.level) {
      updateAccess(requestInfo.data?.initial.level);
      updateStatus(requestInfo.data?.initial.status);
    }

    if (!requestInfo.data) {
      router.push(`/my-workspace/service`);
    }

    return () => {};
  }, [updateAccess, requestInfo.data?.initial.level]);
  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }

    return () => {};
  }, [requestInfo]);

  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Submitted Successfully!');
      router.push(`/my-workspace/registration/track-applications`);
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isSuccess, saveValues.isError]);
  const onSubmit = () => {
    if (requestInfo.data) {
      save({
        data: {
          ...requestInfo.data,
          initial: {
            ...requestInfo.data.initial,
            level: 'Submit',
            status: 'Submit',
          },
          status: 'Submit',
        },
      });
    }
  };
  return (
    <Stack className=" w-full relative">
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && <FormPreview data={requestInfo.data} />}
      <Flex className="justify-end" gap={'md'} p={'md'}>
        {checkAccess('review') && (
          <Button onClick={() => router.push('doc')} variant="outline">
            Back
          </Button>
        )}
        {checkAccess('review') && <Button onClick={onSubmit}>Submit</Button>}
      </Flex>
    </Stack>
  );
}

export default Page;
