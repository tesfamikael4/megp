import { Dashboard } from '@/shared/dashboard/dashboard';
import styles from './page.module.scss';
import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <header className={styles.header}>
        <div>Logo</div>

        <Link className={styles.link} href="/auth/login" passHref>
          Login
        </Link>
      </header>
      <button> button</button>
      <Dashboard />
    </div>
  );
}
