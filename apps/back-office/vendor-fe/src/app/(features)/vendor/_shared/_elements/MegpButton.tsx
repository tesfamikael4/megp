import { Button } from '@mantine/core';
import classes from '../scss/MegpButton.module.scss';

export default function MegpButton() {
  return (
    <div className={classes.megpbutton}>
      <button className={classes.button}>Create Version</button>
    </div>
  );
}
