import TablePage from '../_shared/_elements/table';
import classes from './MainContent.module.scss';
import PaymentPage from './Payment';
import ReviewByTeamLeaderPage from './ReviewByTeamLeader';
import ReviewVendorRequest from './ReviewVendorRequest';
export default function MainContentPage({
  selectedItem,
}: {
  selectedItem: string;
}) {
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
