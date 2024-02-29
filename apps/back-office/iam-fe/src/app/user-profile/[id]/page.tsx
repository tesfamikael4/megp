import { PageLayout } from '@megp/core-fe';

import UserProfileForm from '../_component/user-profile';
import Protected from '@/app/(features)/protected';
export default function EntityLayout() {
  return (
    <Protected>
      <PageLayout>
        <UserProfileForm />
      </PageLayout>
    </Protected>
  );
}
