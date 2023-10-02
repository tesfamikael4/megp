import { Button } from '@mantine/core';
import classes from '../scss/TableSectionHeader.module.scss';

export default function TableSectionHeaderPage() {
  return (
    <div className={classes.container}>
      <div>
        <span>Business Process Detail</span>
      </div>

      <div className={classes.right}>
        <Button>Create version</Button>
        <Button>Collapse</Button>
      </div>
    </div>
  );
}
