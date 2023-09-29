import { Textarea, Button } from '@mantine/core';
import classes from './ReviewVendorRequest.module.scss';
export default function ReviewVendorRequest() {
  return (
    <div className={classes.mainWrapper}>
      <div className={classes.Review}>
        <span>Review Request</span>
      </div>

      <div>
        <Textarea label="Remark:" />
      </div>
      <div className={classes.buttonWrapper}>
        <Button className={classes.Adjust}>Adjust</Button>
        <Button className={classes.Reject}>Reject</Button>
        <Button className={classes.Approve}>Approve</Button>
      </div>
    </div>
  );
}
