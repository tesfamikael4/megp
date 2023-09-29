import classes from './MainContent.module.scss';
import PlaceholderIcon from '../_shared/icons/placeholder';
import TablePage from '../_shared/_elements/table';
import MainContentHeaderPage from './MainContentHeader';
import { Button } from '@mantine/core';
import ReviewVendorRequest from './ReviewVendorRequest';
import PaymentPage from './Payment';
import ReviewByTeamLeaderPage from './ReviewByTeamLeader';
export default function MainContentPage({ selectedItem }) {
  let content;

  switch (selectedItem) {
    case 'TablePage':
      content = <TablePage />;
      break;
    case 'Review by team leader':
      content = <ReviewByTeamLeaderPage />;
      break;
    case 'Payment':
      content = <PaymentPage />;
      break;
    default:
      content = <ReviewVendorRequest />;
  }

  return <div className={classes.content}>{content}</div>;
}
