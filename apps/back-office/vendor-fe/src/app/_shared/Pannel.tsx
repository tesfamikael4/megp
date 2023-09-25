import {
  Button,
  Group,
  Collapse,
  Box,
  Divider,
  Text,
  Paper,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './pannel.style.scss';
type PannelProps = {
  title?: string;
  titleDescription?: string;
  showCollapseButton?: boolean;
  collapseButtonPosition?: 'right';
  onHandleAction?: (e: React.MouseEvent) => void;
  actionText?: string;
  actionIcon?: React.ReactNode;
  children: React.ReactNode;
  actionButtonVariant?: string;
  isCompact?: boolean;
  expanded?: boolean;
  className?: string;
  id?: string;
  onExpand?: () => void;
};

function Pannel({
  title,
  titleDescription,
  showCollapseButton = true,
  collapseButtonPosition = 'right',
  actionText,
  actionIcon,
  actionButtonVariant = 'outline',
  isCompact = true,
  onHandleAction,
  children,
  expanded = true,
  className,
  onExpand,
}: PannelProps) {
  const [opened, { toggle }] = useDisclosure(expanded);

  const pannelTitle = title ? (
    <div className="title">
      <Text fz="lg">{title}</Text>
      <Text color="dimmed" size="xs">
        {titleDescription}
      </Text>
    </div>
  ) : (
    <span></span>
  );

  const collapseButton = showCollapseButton ? (
    <Group position={collapseButtonPosition} mb={5}>
      {showCollapseButton && (
        <Button
          className="btn"
          compact
          variant="outline"
          onClick={() => {
            toggle();
            onExpand ? onExpand() : '';
          }}
          color="gray"
          size="sm"
        >
          {opened ? 'Collapse' : 'Expand'}
        </Button>
      )}
    </Group>
  ) : (
    <span></span>
  );

  return (
    <Box className={`box ${className}`} maw={'100%'} mx="auto">
      <Paper shadow="lg" p={'md'}>
        <div className="header">
          {pannelTitle}
          <div className="action-btn">
            {actionText && opened && (
              <Group mb={5}>
                <Button
                  className={
                    actionButtonVariant == 'filled' ? 'btn filled' : 'btn'
                  }
                  variant={actionButtonVariant}
                  onClick={onHandleAction}
                  compact={isCompact}
                  size="sm"
                >
                  {actionIcon}
                  {actionText}
                </Button>
              </Group>
            )}
            {collapseButton}
          </div>
        </div>
        <div style={{ clear: 'both' }}>
          <Divider mih={30} />
        </div>
        <div className="pl-2">
          <Collapse in={opened}>{children}</Collapse>
        </div>
      </Paper>
    </Box>
  );
}
export default Pannel;
