import { Timeline, Text, Box, LoadingOverlay } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useGetActivitiesProgressQuery } from '../../_api/query';
type Props = {
  instanceId: string;
};

const ProgressBar: React.FC<Props> = ({ instanceId }) => {
  const requestInfo = useGetActivitiesProgressQuery({
    instanceId,
  });

  if (requestInfo.isLoading) {
    return (
      <Box pos="relative" className="w-full h-full">
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Box>
    );
  }
  if (requestInfo.isError) {
    return null;
  }
  if (requestInfo.isSuccess && requestInfo.data) {
    const taskNames: string[] = requestInfo.data.map(
      (taskItem) => taskItem.task.name,
    );
    const activists = requestInfo.data
      .map((taskItem) => taskItem)
      .filter((taskItem) => taskItem.task.handlerType === 'Assignee')
      .reverse();
    const activeTask: number = activists.reduceRight(
      (lastIndex: number, taskItem, index: number) =>
        taskItem.taskHandler !== null ? index : lastIndex,
      -1,
    );
    return (
      <Timeline
        active={activeTask === -1 ? 0 : activeTask}
        bulletSize={24}
        lineWidth={2}
      >
        {activists &&
          activists.map((taskItem, index) => (
            <Timeline.Item
              key={index}
              bullet={activeTask > index ? <IconCheck size={12} /> : index + 1}
              title={taskItem.task.label}
            >
              <Text c="dimmed" size="sm">
                Remark:
              </Text>
            </Timeline.Item>
          ))}
      </Timeline>
    );
  }

  return null;
};

export default ProgressBar;
