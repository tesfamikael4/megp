// import styles from './layout.module.scss';

import Link from 'next/link';
import { Profile, Security } from './navItems';
import Protected from '../protected';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <section>
        <div className="border mx-auto min-h-[90vh] flex">
          <div className="w-2/12 bg-gray-100">
            <Link href="/my/my-profile" className="active:bg-primary-600">
              <Profile />
            </Link>
            <Link href="/my/security" className="active:bg-primary-800">
              <Security />
            </Link>
          </div>
          <div className="w-8/12">{children}</div>
        </div>
      </section>
    </Protected>
  );
}
