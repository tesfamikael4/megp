import { Alert, List, Text } from '@mantine/core';
import { IconAlertCircle, IconPin } from '@tabler/icons-react';
import style from './layout.module.scss';

export const RequestAlertMessage = () => {
  return (
    <Alert
      icon={<IconAlertCircle size="1rem" />}
      title={
        <Text weight={500} size={'sm'}>
          To access the supplier registration electronic form, please provide
          your company tax identification number, country of registration, and
          legal form of your company.
        </Text>
      }
      color="cyan"
      className={style.reqAlert}
    >
      <Text weight={600} m={6}>
        Why Register?
      </Text>
      <List spacing="sm" size="sm" center icon={<IconPin size="1rem" />}>
        <List.Item>
          Participate actively in tenders. Submit your bids and request for
          clarifications
        </List.Item>
        <List.Item>
          Become a registered supplier and receive notifications for new tenders
        </List.Item>
        <List.Item>
          Receive reminders and notifications for important tender activities
        </List.Item>
      </List>

      <Text mt={20} size="sm">
        Note: To get approval of your company registration, you need to attach a
        scanned copy of a signed and stamped official power of attorney letter
        from the companys general manager. Falsifying documents and/or
        misrepresenting data is a serious offense that can result in criminal
        charges.
      </Text>
    </Alert>
  );
};
