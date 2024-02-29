import { PageLayout } from '@megp/core-fe';

import UserpasswordForm from './_component/change-password';
import Protected from '@/app/(features)/protected';
export default function EntityLayout() {
  return (
    <Protected>
      <PageLayout>
        <UserpasswordForm />
      </PageLayout>
    </Protected>
  );
}
