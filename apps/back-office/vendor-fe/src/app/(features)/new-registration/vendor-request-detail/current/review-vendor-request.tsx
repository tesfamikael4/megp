import { Textarea, Button, Box, Checkbox, Text, Divider } from '@mantine/core';
import classes from './review-vendor-request.module.scss';
import { useGoToNextStateMutation } from '@/store/api/vendor_request_handler/new_registration_query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewVendorRequest({
  instanceId,
  remark,
  onRemarkChange,
  taskCheckLists,
}: {
  instanceId: any;
  remark: any;
  onRemarkChange: any;
  taskCheckLists: any;
}) {
  const [mutate] = useGoToNextStateMutation();
  const router = useRouter();
  const [selectedChecklistItems, setSelectedChecklistItems] = useState<
    Record<string, boolean>
  >({});

  const handleButtonClick = (action) => {
    const selectedItems: Record<string, boolean> = {};

    taskCheckLists.forEach((checkListItem) => {
      const itemId = checkListItem.id;
      selectedItems[itemId] = !!selectedChecklistItems[itemId];
    });

    const requestData = {
      instanceId: instanceId,
      action: action,
      taskChecklist: selectedItems,
      handlerId: instanceId,
      remark: remark,
    };

    mutate(requestData)
      .then(() => {
        router.push('/new-registration');
        //window.location.href = '';
      })
      .catch(() => {
        // Handle any errors here
      });
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedChecklistItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [itemId]: !prevSelectedItems[itemId],
    }));
  };
  return (
    <div className={classes.mainWrapper}>
      <div style={{ paddingBottom: '2vh' }}>
        <Box style={{ padding: '5px' }}>
          <Text className={classes.checkLists}>Check lists: </Text>

          <Box>
            {taskCheckLists.map((checkLIstItem) => (
              <Box key={checkLIstItem.id} className={classes.checkLists}>
                <Checkbox
                  className={classes.checkList}
                  label={checkLIstItem.description}
                  onChange={() => handleCheckboxChange(checkLIstItem.id)}
                />
              </Box>
            ))}
          </Box>

          <Box className={classes.filePicker}>
            <Textarea
              label="Remark:"
              rows={4}
              value={remark}
              onChange={(event) => onRemarkChange(event.target.value)}
            />
          </Box>
          <Divider my="sm" />
          <Box className={classes.buttonWrapper}>
            <Button onClick={() => handleButtonClick('Approve')}>
              Approve
            </Button>
            <Button
              className={classes.Adjust}
              onClick={() => handleButtonClick('Adjust')}
            >
              Adjust
            </Button>
            <Button
              className={classes.Reject}
              onClick={() => handleButtonClick('REJECT')}
            >
              Reject
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
}
