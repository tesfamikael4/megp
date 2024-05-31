import { TenderOverView } from '../../evaluation/_components/tender-overview';
import { Team } from './_components/team';

export default function BidAdministrationDetail() {
  return (
    <>
      <TenderOverView basePath="/administration" />
      <Team />
    </>
  );
}
