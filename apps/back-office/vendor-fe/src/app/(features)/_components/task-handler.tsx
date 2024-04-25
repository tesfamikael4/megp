'use ';
import {
  useGetVendorQuery,
  useGoToNextStateMutation,
} from '@/store/api/vendor_request_handler/new-registration-api';
import { Box, Button, Checkbox, Flex, Textarea } from '@mantine/core';
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
  setHideUnPick,
  isrVendor,
}: {
  taskType: string | undefined;
  instanceID: string | undefined;
  taskCheckLists: any[];
  requesterID: string | undefined;
  setIsPicked: React.Dispatch<React.SetStateAction<boolean>>;
  setHideUnPick: React.Dispatch<React.SetStateAction<boolean>>;
  requestType: 'new' | 'renewal' | 'upgrade' | 'update' | 'preferential';
  isrVendor?: { status: string };
}) {
  const [mutate] = useGoToNextStateMutation();
  const [loading, setLoading] = useState({});
  const [remark, setRemark] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [selectedChecklistItems, setSelectedChecklistItems] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  const handleButtonClick = async (action) => {
    if (remark) {
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

      try {
        await mutate(requestData)
          .unwrap()
          .then((value) => {
            if (value) {
              if (value?.status === 'Completed') {
                notifications.show({
                  title: 'Success',
                  message: 'Task has been completed',
                  color: 'green',
                });
                setIsPicked(false);
                router.push(
                  `/${requestType === 'update' ? 'info-change' : requestType === 'preferential' ? 'preferential-services' : requestType}`,
                );
              } else {
                notifications.show({
                  title: 'Success',
                  message: 'Task has been updated',
                  color: 'green',
                });
                router.refresh();
              }
              setIsPicked(false);
              // router.push(
              //   `/${requestType === 'update' ? 'info-change' : requestType === 'preferential' ? "preferential-services" : requestType}`,
              // );
            } else {
              notifications.show({
                title: 'Success',
                message: 'Task has been completed',
                color: 'green',
              });
              setIsPicked(false);
            }
            setLoadingState(action, false);
          });
      } catch (error) {
        setLoadingState(action, false);
        notifications.show({
          title: 'Error',
          message: 'Something went wrong',
          color: 'red',
        });
      }
    } else {
      setError('Remark is required');
    }
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
      {(taskType === 'Confirmation' ||
        taskType === 'Approval' ||
        'InitialReview') && (
        <Textarea
          label="Remark"
          rows={4}
          required
          placeholder="Enter Remark here"
          onChange={(event) => {
            if (event.currentTarget.value) {
              setError(null);
            } else {
              setError('Remark is required');
            }

            setRemark(event.currentTarget.value);
          }}
          className="mt-3 mb-5"
          onFocus={() => {
            if (remark) setError(null);
          }}
          onBlur={() => {
            if (!remark) {
              setError('Remark is required');
            }
          }}
          error={error && error}
        />
      )}

      {taskType === 'InitialReview' && (
        <Flex direction="row" className="gap-2 mt-4 ml-auto">
          <Button
            onClick={() => handleButtonClick('APPROVE')}
            loading={loading['APPROVE']}
          >
            Approve
          </Button>
          {requestType !== 'renewal' &&
            requestType !== 'upgrade' &&
            requestType !== 'preferential' &&
            isrVendor?.status !== 'Approved' && (
              <Button
                onClick={() => {
                  handleButtonClick('ADJUST');
                  if (remark) {
                    router.push(
                      `/${requestType === 'update' ? 'info-change' : requestType}`,
                    );
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-600"
                loading={loading['ADJUST']}
              >
                Adjust
              </Button>
            )}

          <Button
            onClick={() => {
              ``;
              handleButtonClick('Cancel');
              if (remark) {
                router.push(
                  `/${requestType === 'update' ? 'info-change' : requestType === 'preferential' ? 'preferential-services' : requestType}`,
                );
              }
            }}
            className="bg-red-600 hover:bg-red-700"
            loading={loading['Cancel']}
          >
            Cancel
          </Button>
        </Flex>
      )}
      {taskType === 'Approval' && (
        <Flex direction="row" className="gap-2 mt-4 ml-auto">
          <Button
            onClick={() => handleButtonClick('APPROVE')}
            loading={loading['APPROVE']}
          >
            Approve
          </Button>
          {requestType !== 'renewal' &&
            requestType !== 'upgrade' &&
            requestType !== 'preferential' &&
            isrVendor?.status !== 'Approved' && (
              <Button
                onClick={() => {
                  handleButtonClick('ADJUST');
                  if (remark) {
                    router.push(
                      `/${requestType === 'update' ? 'info-change' : requestType}`,
                    );
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-600"
                loading={loading['ADJUST']}
              >
                Adjust
              </Button>
            )}
          <Button
            onClick={() => {
              handleButtonClick(requestType === 'update' ? 'Cancel' : 'REJECT');
              if (remark) {
                router.push(
                  `/${requestType === 'update' ? 'info-change' : requestType === 'preferential' ? 'preferential-services' : requestType}`,
                );
              }
            }}
            className="bg-red-600 hover:bg-red-700"
            loading={loading['REJECT']}
          >
            {requestType === 'update' ? 'Cancel' : 'Reject'}
          </Button>
        </Flex>
      )}

      {taskType === 'Confirmation' && (
        <Flex direction="row" className="gap-2 mt-4 ml-auto">
          <Button
            onClick={() => handleButtonClick('YES')}
            loading={loading['YES']}
          >
            Approve
          </Button>
          {requestType !== 'renewal' &&
            requestType !== 'upgrade' &&
            requestType !== 'preferential' &&
            isrVendor?.status !== 'Approved' && (
              <Button
                onClick={() => {
                  handleButtonClick('NO');
                  if (remark) router.push(`/${requestType}`);
                }}
                className="bg-yellow-500 hover:bg-yellow-600"
                loading={loading['ADJUST']}
              >
                Adjust
              </Button>
            )}
        </Flex>
      )}
    </Box>
  );
}
