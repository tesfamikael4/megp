// import styles from './layout.module.scss';

import Link from 'next/link';
import { Profile, Security } from './navItems';
import Protected from './Protected';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <section>
        <div className="w-2/3 border mx-auto min-h-[80vh] mt-4 mb-4 flex">
          <div className="w-3/12 bg-gray-100">
            <Link href="/my/my-profile" className="active:bg-primary-800">
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
