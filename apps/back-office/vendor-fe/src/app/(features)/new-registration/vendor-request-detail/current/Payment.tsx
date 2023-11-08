import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import classes from './Payment.module.scss';

export default function PaymentPage() {
  return (
    <div>
      <div className={classes.formWrapper}>
        <TextInput label="Net Amount" />
        <TextInput label="Tax Amount" />
        <TextInput label="Stamp Duty" />
        <TextInput label="Penality" />
        <TextInput label="Debt" />
        <TextInput label="Discount" />

        <div>
          <Button style={{ marginTop: '15px' }}>Done</Button>
        </div>
      </div>
    </div>
  );
}
