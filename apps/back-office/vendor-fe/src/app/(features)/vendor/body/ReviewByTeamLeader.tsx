import { Textarea, Button } from '@mantine/core';
import classes from './ReviewVendorRequest.module.scss';
export default function ReviewByTeamLeaderPage() {
  return (
    <div className={classes.mainWrapper}>
      <div className={classes.Review}>
        <span>Confirmation</span>
      </div>

      <div>
        <Textarea label="Remark:" />
      </div>
      <div className={classes.buttonWrapper}>
        <Button className={classes.Reject}>No</Button>
        <Button className={classes.Approve}>Yes</Button>
      </div>
    </div>
  );
}
