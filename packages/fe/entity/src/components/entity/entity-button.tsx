import { Group, Button } from '@mantine/core';
import { IconDeviceFloppy, IconBackspace } from '@tabler/icons-react';
import React from 'react';
import { DeleteButton } from './delete-popup';

interface EntityButtonProps {
  mode?: 'new' | 'detail';
  onCreate?: () => void;
  onReset?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function EntityButton({
  mode,
  onCreate,
  onReset,
  onUpdate,
  onDelete,
  isSaving,
  isUpdating,
  isDeleting,
}: EntityButtonProps): React.ReactElement {
  return (
    <Group className="border-t pt-4">
      {mode === 'new' && (
        <>
          {onCreate ? (
            <Button
              leftSection={<IconDeviceFloppy size={14} stroke={1.6} />}
              loading={isSaving}
              onClick={onCreate}
            >
              Save
            </Button>
          ) : null}
          <Button
            leftSection={<IconBackspace size={14} stroke={1.6} />}
            onClick={onReset}
            variant="default"
          >
            Reset
          </Button>
        </>
      )}
      {mode === 'detail' && (
        <>
          {onUpdate ? (
            <Button
              leftSection={<IconDeviceFloppy size={14} stroke={1.6} />}
              loading={isUpdating}
              onClick={onUpdate}
              type="submit"
            >
              Update
            </Button>
          ) : null}

          {onDelete ? (
            <DeleteButton isDeleting={isDeleting} onDelete={onDelete} />
          ) : null}
        </>
      )}
    </Group>
  );
}
