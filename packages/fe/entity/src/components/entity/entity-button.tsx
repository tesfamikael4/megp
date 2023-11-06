import { Group, Button } from '@mantine/core';
import {
  IconDeviceFloppy,
  IconBackspace,
  IconFolderCancel,
  IconToggleLeft,
  IconToggleRight,
} from '@tabler/icons-react';
import React from 'react';
import { DeleteButton } from './delete-popup';

interface EntityButtonProps {
  mode?: 'new' | 'detail';

  onCreate?: () => void;
  onReset?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  onActivate?: () => void;
  isSaving?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isActivating?: boolean;

  data?: any;
}

export function EntityButton({
  mode,
  onCreate,
  onReset,
  onUpdate,
  onDelete,
  isSaving,
  data,
  isUpdating,
  isDeleting,
  onCancel,
  onActivate,
  isActivating,
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
          {data ? (
            <Button
              color={data?.isActive ? 'red' : ''}
              leftSection={
                data?.isActive ? (
                  <IconToggleLeft size={14} stroke={1.6} />
                ) : (
                  <IconToggleRight size={14} stroke={1.6} />
                )
              }
              loading={isActivating}
              onClick={onActivate}
              type="submit"
            >
              {data?.isActive ? 'Deactivate' : 'activate'}
            </Button>
          ) : null}

          {onDelete ? (
            <DeleteButton isDeleting={isDeleting} onDelete={onDelete} />
          ) : null}
          {onCancel ? (
            <Button
              color="red"
              leftSection={<IconFolderCancel size={14} stroke={1.6} />}
              onClick={onCancel}
            >
              cancel
            </Button>
          ) : null}
        </>
      )}
    </Group>
  );
}
