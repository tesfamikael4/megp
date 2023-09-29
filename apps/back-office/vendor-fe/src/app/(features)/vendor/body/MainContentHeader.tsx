import ActivityAuditIcon from '../_shared/icons/ActivityAudit';
import CloseIcon from '../_shared/icons/Close';
import HelpIcon from '../_shared/icons/Help';
import NoteIcon from '../_shared/icons/Help';
import classes from './MainContentHeader.module.scss';
import FullScreenIcon from '../_shared/icons/FullScreen';
import { Tooltip } from '@mantine/core';
export default function MainContentHeaderPage() {
  return (
    <div className={classes.header}>
      <div>Task type</div>
      <div className="flex flex-row space-x-4 mr-4 pt-4">
        <Tooltip label="Full screen">
          <div>
            <FullScreenIcon />
          </div>
        </Tooltip>
        <Tooltip label="Close">
          <div>
            <CloseIcon />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
