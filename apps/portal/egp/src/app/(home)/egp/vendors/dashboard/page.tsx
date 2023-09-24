import { InfoCardsSection } from '../_shared/components/dashboard/infoCardsSection';
import { PageContainer } from '../_shared/components/pageContainer/PageContainer';

export default function Page() {
  return (
    <PageContainer title="Dashboard">
      <InfoCardsSection />
    </PageContainer>
  );
}
