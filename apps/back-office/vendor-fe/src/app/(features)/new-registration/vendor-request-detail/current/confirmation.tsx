import { Textarea, Button, Checkbox, Box, Text, Divider } from '@mantine/core';
import classes from './confirmation.module.scss';
import { useGoToNextStateMutation } from '@/store/api/vendor_request_handler/new_registration_query';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

export default function ConfirmationPage({
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
    number[]
  >([]);

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
      value: selectedChecklistItems,
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
  // Assuming selectedChecklistItems is an array of numbers
  const handleCheckboxChange = (itemId: number) => {
    if (selectedChecklistItems.includes(itemId)) {
      // If the item ID is already in the selected items, remove it
      setSelectedChecklistItems(
        selectedChecklistItems.filter((id) => id !== itemId),
      );
    } else {
      // If the item ID is not in the selected items, add it
      setSelectedChecklistItems([...selectedChecklistItems, itemId]);
    }
  };

  return (
    <Box className={classes.mainWrapper}>
      <Box>
        <Text className={classes.checkLists}>Check lists: </Text>

        <Box>
          {taskCheckLists.map((checkLIstItem) => (
            <Box key={checkLIstItem.id} className={classes.checkLists}>
              <Checkbox
                className={classes.checkList}
                defaultChecked
                label={checkLIstItem.description}
                onChange={() => handleCheckboxChange(checkLIstItem.id)}
              />
            </Box>
          ))}
        </Box>
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
        <Button onClick={() => handleButtonClick('YES')}>Yes</Button>
        <Button className={classes.No} onClick={() => handleButtonClick('NO')}>
          No
        </Button>
      </Box>
    </Box>
  );
}
