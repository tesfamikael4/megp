import { Timeline, Text } from '@mantine/core';
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
  IconForms,
  IconCheck,
  IconNotification,
} from '@tabler/icons-react';

export default function ProgressBar() {
  return (
    <Timeline active={1} bulletSize={24} lineWidth={2}>
      <Timeline.Item bullet={<IconForms size={12} />} title="Submitted">
        <Text c="dimmed" size="sm">
          You&apos;ve created new branch{' '}
        </Text>
        <Text size="xs" mt={4}>
          2 hours ago
        </Text>
      </Timeline.Item>

      <Timeline.Item bullet={<IconCheck size={12} />} title="Review">
        <Text c="dimmed" size="sm">
          You&apos;ve pushed 23 commits to
        </Text>
      </Timeline.Item>

      <Timeline.Item
        title="Pull request"
        bullet={<IconNotification size={12} />}
        lineVariant="dashed"
      >
        <Text c="dimmed" size="sm">
          Notification
        </Text>
        <Text size="xs" mt={4}>
          34 minutes ago
        </Text>
      </Timeline.Item>

      <Timeline.Item title="Code review" bullet={<IconMessageDots size={12} />}>
        <Text c="dimmed" size="sm">
          <Text variant="link" component="span" inherit>
            Robert Gluesticker
          </Text>{' '}
          left a code review on your pull request
        </Text>
        <Text size="xs" mt={4}>
          12 minutes ago
        </Text>
      </Timeline.Item>
    </Timeline>
  );
}
