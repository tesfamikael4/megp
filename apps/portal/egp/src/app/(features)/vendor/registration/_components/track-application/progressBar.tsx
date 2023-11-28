import { Timeline, Text, Box, LoadingOverlay } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useGetActivitiesProgressQuery } from '../../_api/query';
type Props = {
  instanceId: string;
};

const ProgressBar: React.FC<Props> = ({ instanceId }) => {
  const requestInfo = useGetActivitiesProgressQuery({
    instanceId: '80f4963e-2d5d-4bcd-a767-da4fc46bb2d8',
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
        {/* <Timeline.Item
          bullet={<IconForms size={12} />}
          title="Submitted Vendor Registration Request"
        >
          <Text c="dimmed" size="sm">
            Remark: You&apos;ve created new branch{' '}
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<IconCheck size={12} />}
          title="Reviewed Vendor Registration Request"
        >
          <Text c="dimmed" size="sm">
            Remark: You&apos;ve pushed 23 commits to
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Approval of Vendor Registration Request By CRO"
          bullet={<IconNotification size={12} />}
          lineVariant="dashed"
        >
          <Text c="dimmed" size="sm">
            Remark: Notification
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Final Approval of New Vendor Registration by RRM"
          bullet={<IconCheck size={12} />}
        >
          <Text c="dimmed" size="sm">
            <Text variant="link" component="span" inherit>
              Remark: Robert Gluesticker
            </Text>
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Generate Vendor Registration Certificate"
          bullet={<IconCertificate size={12} />}
        >
          <Text c="dimmed" size="sm">
            <Text variant="link" component="span" inherit>
              Remark: Robert Gluesticker
            </Text>
          </Text>
        </Timeline.Item> */}
      </Timeline>
    );
  }

  return null;
};

export default ProgressBar;
