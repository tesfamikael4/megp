'use client';
import React, { useEffect } from 'react';
import FormPreview from '../_components/review';
import { getCookie } from 'cookies-next';
import { useAddFormMutation, useGetFormQuery } from '../_api/query';
import { Button, Flex, LoadingOverlay, Stack } from '@mantine/core';
import { NotificationService } from '../../../_components/notification';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();
  const vendorId = getCookie('vendorId') || '';
  const requestInfo = useGetFormQuery({
    vendorId,
  });
  const [save, saveValues] = useAddFormMutation();

  useEffect(() => {
    if (requestInfo.isError) {
      NotificationService.requestErrorNotification('Error on fetching data');
      router.push(`basic`);
    }

    return () => {};
  }, [requestInfo, router]);

  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Submitted Successfully!');
      // router.push(`/vendor/track-applications`);
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isSuccess, saveValues.isError, router]);
  const onSubmit = () => {
    save({
      data: {
        ...requestInfo.data,
        level: 'Submitted',
        status: 'Submit',
      },
    });
  };
  return (
    <Stack className=" w-full relative">
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {requestInfo.data && <FormPreview data={requestInfo.data} />}
      <Flex className="justify-end">
        <Button onClick={onSubmit}>Submit</Button>
      </Flex>
    </Stack>
  );
}

export default Page;
