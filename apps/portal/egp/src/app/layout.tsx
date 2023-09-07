import './globals.css';
import type { Metadata } from 'next';

import RootStyleRegistry from './mantine';
import { Providers } from '@/store/provider';
import styles from './page.module.scss';
import Link from 'next/link';
import { DropDownMenus } from './_shared/landing/nav-dropdown-menus';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'M-egp',
  description: 'Malawi electronic government procurements',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <RootStyleRegistry>
            {/* header */}
            <header className={styles.header}>
              <nav className={styles.nav}>
                <div className={styles.headerContainer}>
                  <Image src="/ppda.png" alt="logo" width="70" height="20" />

                  <ul className={styles.navLinks}>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/">Tenders</Link>
                    </li>
                    <li>
                      <Link href="/">Procurement Information</Link>
                    </li>
                    <li>
                      <Link href="/">Registration Services</Link>
                    </li>
                    <li>
                      <DropDownMenus />
                    </li>
                  </ul>

                  <ul className={styles.navActions}>
                    <li>
                      <Link href="/auth/login" passHref>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/signup" passHref>
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>

            {/* body */}

            {children}

            {/* Footer */}
            <footer className={styles.footer}>
              <section className={styles.footerContainer}>
                <div className={styles.footerGrid}>
                  {/* ABOUT eGP */}
                  <div className="md:col-span-2">
                    <h2 className="text-sm mb-4">ABOUT eGP</h2>
                    <p className="text-sm">
                      Electronic Government Procurement (eGP) refers to the use
                      of digital technologies to enable a more efficient and
                      transparent exchange of information, and interactions and
                      transactions between government and the business community
                      in the procurement of goods, services, and works. E-GP
                      automates and streamlines the end-to-end public
                      procurement process from the preparation and publication
                      of annual procurement plans, managing the various
                      tendering activities, and administration of contracts.
                    </p>
                  </div>

                  {/* CONTACT US */}
                  <div className="md:col-span-1">
                    <h2 className="text-sm mb-4">CONTACT US</h2>
                    <address className="text-sm">
                      Public Procurement and Disposal of Assets Authority,
                      <br />
                      The Jireh Bible House,
                      <br />
                      Area 3,
                      <br />
                      Off Colby Road,
                      <br />
                      Private Bag 383,
                      <br />
                      Capital City,
                      <br />
                      Lilongwe 3,
                      <br />
                      Phone: (256)0 887 083 261
                      <br />
                      Email: <a href="mailto:dg@ppda.mw">dg@ppda.mw</a>
                      <br />
                      Website: <a href="http://www.ppda.mw/">www.ppda.mw</a>
                      <br />
                      Malawi
                    </address>
                  </div>

                  {/* IMPORTANT LINKS */}
                  <div className="md:col-span-1">
                    <h2 className="text-sm mb-4">IMPORTANT LINKS</h2>
                    <ul className="list-disc list-inside">
                      <li>
                        <a href="http://www.malawi.gov.mw/">
                          www.malawi.gov.mw
                        </a>
                      </li>
                      <li>
                        <a href="http://www.mra.mw/">www.mra.mw</a>
                      </li>
                      <li>
                        <a href="http://www.registrargeneral.gov.mw/">
                          www.registrargeneral.gov.mw
                        </a>
                      </li>
                      <li>
                        <a href="http://www.ncic.mw/">www.ncic.mw</a>
                      </li>
                      <li>
                        <a href="http://www.trade.gov.mw/">www.trade.gov.mw</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <hr className="my-6" />

                {/* COPYRIGHT */}
                <div className={styles.copyright}>
                  <p>
                    Copyright © 2023, Public Procurement and Disposal of Assets
                    Authority. All Rights Reserved
                  </p>
                  <div className="flex">
                    <p>Powered By :</p>
                    <Image
                      src="/perago.png"
                      alt="perago logo"
                      height="20"
                      width="70"
                    />
                  </div>
                </div>
              </section>
            </footer>
          </RootStyleRegistry>
        </Providers>
      </body>
    </html>
  );
}
