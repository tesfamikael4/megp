'use ';
import {
  useGenerateCertificateMutation,
  useGoToNextStateMutation,
} from '@/store/api/vendor_request_handler/new-registration-api';
import { Box, Checkbox, Textarea, Button, Flex } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GeneratePdf } from './generatePdf';

export default function TaskHandler({
  taskType,
  instanceID,
  taskCheckLists,
  setIsPicked,
  requesterID,
  requestType,
}: {
  taskType: string | undefined;
  instanceID: string | undefined;
  taskCheckLists: any[];
  requesterID: string | undefined;
  setIsPicked: React.Dispatch<React.SetStateAction<boolean>>;
  requestType: 'new' | 'renewal' | 'upgrade';
}) {
  const [mutate] = useGoToNextStateMutation();
  const [loading, setLoading] = useState({});
  const [remark, setRemark] = useState<string>();
  const [selectedChecklistItems, setSelectedChecklistItems] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  const handleButtonClick = (action) => {
    const selectedItems: Record<string, boolean> = {};

    taskCheckLists?.forEach((checkListItem) => {
      const itemId = checkListItem.id;
      selectedItems[itemId] = !!selectedChecklistItems[itemId];
    });

    const requestData = {
      instanceId: instanceID,
      action: action,
      handlerId: instanceID,
      selectedItems: selectedItems,
      remark: remark,
    };
    setLoadingState(action, true);

    mutate(requestData).then(() => {
      notifications.show({
        title: 'Success',
        message: 'Task has been updated.',
        color: 'green',
      });
      setIsPicked(false);
      router.refresh();
    });
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedChecklistItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [itemId]: !prevSelectedItems[itemId],
    }));
  };

  const setLoadingState = (button_id, status) => {
    setLoading({
      [button_id]: status,
    });
  };

  if (taskType === 'Certificate') {
    return (
      <Flex gap="md">
        <GeneratePdf
          label="Download Cerficate"
          id={`${requesterID as string}/${instanceID as string}`}
          className=""
          mode="view"
          apiUrl={`${process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'}`}
        />
      </Flex>
    );
  }

  return (
    <Box className="my-4">
      {taskCheckLists?.map((checkLIstItem) => (
        <Checkbox
          key={checkLIstItem.id}
          className="mt-2"
          label={checkLIstItem.description}
          onChange={() => handleCheckboxChange(checkLIstItem.id)}
          required
        />
      ))}
      {(taskType === 'Confirmation' || taskType === 'Approval') && (
        <Textarea
          label="Remark"
          rows={4}
          required
          placeholder="Any comments"
          onChange={(event) => setRemark(event.currentTarget.value)}
          className="mt-3 mb-5"
        />
      )}

      {taskType === 'Approval' && (
        <Flex direction="row" className="gap-2 mt-4 ml-auto">
          <Button
            onClick={() => handleButtonClick('APPROVE')}
            loading={loading['APPROVE']}
          >
            Approve
          </Button>
          <Button
            onClick={() => {
              handleButtonClick('ADJUST');
              router.push(`/${requestType}`);
            }}
            className="bg-yellow-500 hover:bg-yellow-600"
            loading={loading['ADJUST']}
          >
            Adjust
          </Button>
          <Button
            onClick={() => {
              handleButtonClick('REJECT');
              router.push(`/${requestType}`);
            }}
            className="bg-red-600 hover:bg-red-700"
            loading={loading['REJECT']}
          >
            Reject
          </Button>
        </Flex>
      )}

      {taskType === 'Confirmation' && (
        <Flex direction="row" className="gap-2 mt-4 ml-auto">
          <Button
            onClick={() => handleButtonClick('YES')}
            loading={loading['YES']}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              handleButtonClick('NO');
              router.push(`/${requestType}`);
            }}
            className="bg-red-600 hover:bg-red-700"
            loading={loading['NO']}
          >
            No
          </Button>
        </Flex>
      )}
    </Box>
  );
}
