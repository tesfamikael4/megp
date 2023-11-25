import { Timeline, Text } from '@mantine/core';
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
  IconForms,
  IconCheck,
  IconNotification,
  IconCertificate,
} from '@tabler/icons-react';

export default function ProgressBar() {
  return (
    <Timeline active={2} bulletSize={24} lineWidth={2}>
      <Timeline.Item
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
      </Timeline.Item>
    </Timeline>
  );
}
