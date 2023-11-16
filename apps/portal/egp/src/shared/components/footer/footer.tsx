import React from 'react';
import styles from './footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';
function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          {/* ABOUT eGP */}

          <div className="md:col-span-2">
            <h2 className="text-sm mb-4">ABOUT eGP</h2>

            <p className="text-sm">
              Electronic Government Procurement (eGP) refers to the use of
              digital technologies to enable a more efficient and transparent
              exchange of information, and interactions and transactions between
              government and the business community in the procurement of goods,
              services, and works. E-GP automates and streamlines the end-to-end
              public procurement process from the preparation and publication of
              annual procurement plans, managing the various tendering
              activities, and administration of contracts.
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
              Area 3,Off Colby Road,
              <br />
              Private Bag 383,
              <br />
              Capital City,Lilongwe 3, Malawi
              <br />
              Phone: (256)0 887 083 261
              <br />
              Email: <a href="mailto:dg@ppda.mw">dg@ppda.mw</a>
              <br />
              Website: <a href="http://www.ppda.mw/">www.ppda.mw</a>
            </address>
          </div>

          {/* IMPORTANT LINKS */}
          <div className="md:col-span-1">
            <h2 className="text-sm mb-4">IMPORTANT LINKS</h2>
            <ul className="list-disc list-inside">
              <li>
                <a href="http://www.malawi.gov.mw/">www.malawi.gov.mw</a>
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
            Copyright © {new Date().getFullYear()}, Public Procurement and
            Disposal of Assets Authority. All Rights Reserved
          </p>
          <div className="flex gap-2 items-center justify-center">
            <span>{process.env.NEXT_PUBLIC_VERSION}</span>
            <p>Powered By </p>
            <Link href="http://peragosystems.com/home">
              <Image
                src="/perago.png"
                alt="perago logo"
                height="20"
                width="70"
              />
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
